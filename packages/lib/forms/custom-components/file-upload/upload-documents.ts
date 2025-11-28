import { validateUploadedFile } from './document-validation-util.ts';
import { PortalService } from 'portal/src/app/service.ts';
import type { Request, Response } from 'express';
import { addSessionData } from '../../../util/session.ts';
import { Readable } from 'stream';
import type { UploadedFile } from './types.d.ts';
import { decodeBlobNameFromBase64, encodeBlobNameToBase64, formatBytes } from './util.ts';
import { TOTAL_UPLOAD_LIMIT } from './constants.ts';
import { getAnswersFromRes } from '../../../util/answers.ts';

export function uploadDocumentsController(
	service: PortalService,
	documentCategoryId: string,
	allowedFileExtensions: string[],
	allowedMimeTypes: string[],
	maxFileSize: number,
	maxNumberOfFiles: number = 3,
	maxNumberOfFilesErrorMsg: string = `You can only upload up to ${maxNumberOfFiles} files at a time`
) {
	return async (req: Request, res: Response) => {
		const { blobStore, logger } = service;

		const files = req.files as Express.Multer.File[];
		const fileErrors = [];

		if (Array.isArray(files) && files.length > maxNumberOfFiles) {
			fileErrors.push({
				text: maxNumberOfFilesErrorMsg,
				href: '#upload-form'
			});
		}

		const fileValidationErrors = (
			await Promise.all(
				files.map((file) => validateUploadedFile(file, logger, allowedFileExtensions, allowedMimeTypes, maxFileSize))
			)
		)
			.flat()
			.filter(Boolean);

		fileErrors.push(...fileValidationErrors);

		const blobAlreadyExists = await Promise.all(
			files.map((file) =>
				blobStore?.doesBlobExist(`${req.session.caseReference}/${documentCategoryId}/${file.originalname}`)
			)
		);

		if (blobAlreadyExists.some(Boolean)) {
			fileErrors.push({
				text: 'Attachment with this name has already been uploaded',
				href: '#upload-form'
			});
		}

		const sessionFilesUploadedSoFar: Express.Multer.File[] =
			req.session?.files?.[documentCategoryId]?.uploadedFiles || [];
		const sessionFilesUploadedSoFarSize: number = sessionFilesUploadedSoFar.reduce(
			(total, file) => total + (file.size || 0),
			0
		);
		const totalSizeUploaded: number = files.reduce((sum, file) => sum + (file.size || 0), 0);

		if (sessionFilesUploadedSoFarSize + totalSizeUploaded > TOTAL_UPLOAD_LIMIT) {
			fileErrors.push({
				text: 'Total file size of all attachments must not exceed 1GB',
				href: '#upload-form'
			});
		}

		const answersFromRes = getAnswersFromRes(res);
		const documentSubCategoryId = answersFromRes.documentType;

		if (fileErrors.length > 0) {
			req.session.errors = {
				'upload-form': { msg: 'Errors encountered during file upload' }
			};
			req.session.errorSummary = fileErrors;
		} else {
			for (const file of files) {
				try {
					const blobName = `${req.session.caseReference}/${documentCategoryId}/${documentSubCategoryId}/${file.originalname}`;
					await blobStore?.uploadStream(Readable.from(file.buffer), file.mimetype, blobName);
				} catch (error) {
					const filename = file.originalname;
					logger.error({ error }, `Error uploading file: ${filename} to blob store`);
					throw new Error(`Failed to upload file: ${filename}`);
				}
			}

			const latestUploads: UploadedFile[] = [];
			files.forEach((file) => {
				const blobName = `${req.session.caseReference}/${documentCategoryId}/${documentSubCategoryId}/${file.originalname}`;
				latestUploads.push({
					fileName: file.originalname,
					size: file.size,
					formattedSize: formatBytes(file.size),
					blobName,
					blobNameBase64Encoded: encodeBlobNameToBase64(blobName)
				});
			});

			const uploadedFiles: UploadedFile[] = [
				...latestUploads,
				...(req.session?.files?.[documentCategoryId]?.uploadedFiles || [])
			];
			addSessionData(req, documentCategoryId, { uploadedFiles }, 'files');
		}

		res.redirect(`${req.baseUrl}/upload/upload-documents`);
	};
}

export function deleteDocumentsController(service: PortalService, documentCategoryId: string) {
	return async (req: Request, res: Response) => {
		const { blobStore, logger } = service;
		const blobName = decodeBlobNameFromBase64(req.params.documentId);
		try {
			blobStore?.deleteBlobIfExists(blobName);
		} catch (error) {
			logger.error({ error, blobName }, `Error deleting file: ${blobName} from Blob store`);
			throw new Error('Failed to delete file');
		}

		let uploadedFiles = req.session?.files?.[documentCategoryId]?.uploadedFiles || [];
		uploadedFiles = uploadedFiles.filter((file: UploadedFile) => file.blobName !== blobName);
		addSessionData(req, documentCategoryId, { uploadedFiles }, 'files');

		res.redirect(`${req.baseUrl}/upload/upload-documents`);
	};
}
