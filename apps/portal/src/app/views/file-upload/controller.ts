import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
// @ts-expect-error - due to not having @types
import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { statusIdRadioButtonValue } from './util.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { Request, Response } from 'express';

export function buildFileUploadHomePage(
	{ db }: PortalService,
	documentTypeId: string,
	viewData = {}
): AsyncRequestHandler {
	return async (req, res) => {
		const documentCategory = await db.documentCategory.findUnique({
			where: { id: documentTypeId }
		});

		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference },
			include: {
				Documents: {
					where: {
						SubCategory: {
							Category: {
								id: documentTypeId
							}
						}
					},
					include: {
						ApfpRegulation: true,
						SubCategory: {
							include: {
								Category: true
							}
						}
					}
				}
			}
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const documentRows = caseData.Documents.map((document) => {
			const { fileName, SubCategory, ApfpRegulation, isCertified, uploadedDate } = document;
			return [
				{ html: `<a class="govuk-link" href="#">${fileName}</a>` },
				{ text: SubCategory?.displayName },
				{ text: ApfpRegulation?.displayName },
				{ text: isCertified ? 'Certified' : 'Not certified' },
				{ text: formatDateForDisplay(uploadedDate, { format: 'dd/MM/yyyy HH:mm' }) },
				{ html: '<a class="govuk-link" href="#">Remove</a>' }
			];
		});

		return res.render('views/file-upload/view.njk', {
			pageTitle: documentCategory?.displayName,
			documentCategory: kebabCaseToCamelCase(documentTypeId),
			documents: documentRows,
			uploadButtonUrl: `${req.baseUrl}/upload/document-type`,
			backLinkUrl: '/',
			isCompletedValue: statusIdRadioButtonValue((caseData as any)[`${kebabCaseToCamelCase(documentTypeId)}StatusId`]),
			...viewData
		});
	};
}

export function buildIsFileUploadSectionCompleted(service: PortalService, documentTypeId: string): AsyncRequestHandler {
	return async (req, res) => {
		const { db } = service;

		const documentCompletedFieldName = `${kebabCaseToCamelCase(documentTypeId)}IsCompleted`;
		const isFileUploadCompleted = req.body[documentCompletedFieldName];

		if (!isFileUploadCompleted) {
			req.body.errors = {
				[documentCompletedFieldName]: { msg: 'You must select an answer' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const fileUploadHomePage = buildFileUploadHomePage(service, documentTypeId, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return fileUploadHomePage(req, res);
		}

		const statusId: string =
			isFileUploadCompleted === BOOLEAN_OPTIONS.YES
				? DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
				: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS;

		await db.case.update({
			where: { reference: req.session.caseReference },
			data: { [`${kebabCaseToCamelCase(documentTypeId)}StatusId`]: statusId }
		});

		res.redirect('/');
	};
}

export function buildDeleteDocumentAndSaveController(service: PortalService): AsyncRequestHandler {
	return async (req: Request, res: Response) => {
		const { db, blobStore, logger } = service;
		const documentId = req.params.documentId;

		if (!documentId) {
			return notFoundHandler(req, res);
		}

		const document = await db.document.findUnique({
			where: { id: documentId }
		});

		if (!document) {
			return notFoundHandler(req, res);
		}

		const blobName = document.blobName;
		try {
			blobStore?.deleteBlobIfExists(blobName);
		} catch (error) {
			logger.error({ error, blobName }, `Error deleting file: ${blobName} from Blob store`);
			throw new Error('Failed to delete file from blob store');
		}

		try {
			await db.$transaction(async ($tx) => {
				await $tx.document.delete({
					where: { id: documentId }
				});
			});
		} catch (error) {
			logger.error({ error, documentId }, `Error deleting file: ${documentId} from database`);
			throw new Error('Failed to delete file from database');
		}

		res.redirect(req.baseUrl);
	};
}
