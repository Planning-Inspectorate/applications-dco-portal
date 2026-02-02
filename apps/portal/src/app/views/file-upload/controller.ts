import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';
import {
	expressValidationErrorsToGovUkErrorList
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import { DOCUMENT_CATEGORY_STATUS_ID, SCAN_RESULT_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { Request, Response } from 'express';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { statusIdRadioButtonValue } from '../util.ts';

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

		const getDateUploadedContent = (scanResultId: string, uploadedDate: Date) => {
			if (scanResultId === SCAN_RESULT_ID.PENDING) {
				return { html: `<strong class="govuk-tag govuk-tag--yellow">Scanning for viruses</strong>` };
			} else if (scanResultId === SCAN_RESULT_ID.AFFECTED) {
				return { html: `<strong class="govuk-tag govuk-tag--red">Failed virus check</strong>` };
			} else {
				return { text: formatDateForDisplay(uploadedDate, { format: 'dd/MM/yyyy HH:mm' }) };
			}
		};

		type TableCell = { text?: string } | { html?: string };
		type TableRow = TableCell[];
		const { documentRows, affectedDocumentRows } = caseData.Documents.reduce<{
			documentRows: TableRow[];
			affectedDocumentRows: TableRow[];
		}>(
			(acc, document) => {
				const { id, fileName, SubCategory, ApfpRegulation, isCertified, uploadedDate, scanResultId } = document;
				if (document.scanResultId === SCAN_RESULT_ID.AFFECTED) {
					acc.affectedDocumentRows.push([
						{
							text: `${fileName}`
						},
						{ text: SubCategory?.displayName },
						{ text: ApfpRegulation?.displayName },
						{ text: isCertified ? 'Certified' : 'Not certified' },
						getDateUploadedContent(scanResultId, uploadedDate),
						{
							html: `<a class="govuk-link govuk-link--no-visited-state" href="${req.baseUrl}/document/delete/${id}">Remove</a>`
						}
					]);
				} else {
					acc.documentRows.push([
						{
							html: `<a class="govuk-link govuk-link--no-visited-state" href="${req.baseUrl}/document/download/${id}" target="_blank" rel="noreferrer">${fileName}</a>`
						},
						{ text: SubCategory?.displayName },
						{ text: ApfpRegulation?.displayName },
						{ text: isCertified ? 'Certified' : 'Not certified' },
						getDateUploadedContent(scanResultId, uploadedDate),
						{
							html: `<a class="govuk-link govuk-link--no-visited-state" href="${req.baseUrl}/document/delete/${id}">Remove</a>`
						}
					]);
				}

				return acc;
			},
			{
				documentRows: [],
				affectedDocumentRows: []
			}
		);

		const documentTypeStatusId = (caseData as any)[`${kebabCaseToCamelCase(documentTypeId)}StatusId`];

		let errors;
		let errorSummary;
		if (req.session?.supportingEvidenceError) {
			errors = req.session.supportingEvidenceError;
			errorSummary = expressValidationErrorsToGovUkErrorList(req.session.supportingEvidenceError);
			delete req.session.supportingEvidenceError;
		}

		return res.render('views/file-upload/view.njk', {
			pageTitle: documentCategory?.displayName,
			documentCategory: kebabCaseToCamelCase(documentTypeId),
			documents: documentRows,
			affectedDocuments: affectedDocumentRows,
			showUploadButton: documentTypeStatusId !== DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			uploadButtonUrl: `${req.baseUrl}/upload/document-type`,
			backLinkUrl: '/',
			isCompletedValue: statusIdRadioButtonValue(documentTypeStatusId),
			errors,
			errorSummary,
			...viewData
		});
	};
}

export function buildDeleteDocumentAndSaveController(
	service: PortalService,
	documentTypeId: string
): AsyncRequestHandler {
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

		const supportingEvidenceDocument = await db.supportingEvidence.findUnique({
			where: {
				caseId_documentId_subCategoryId: {
					caseId: document.caseId,
					documentId: document.id,
					subCategoryId: document.subCategoryId
				}
			}
		});

		if (supportingEvidenceDocument) {
			req.session.supportingEvidenceError = {
				[`${kebabCaseToCamelCase(documentTypeId)}DocumentTable`]: {
					msg: 'You cannot delete a document that is being used as supporting evidence in the application form'
				}
			};
			return res.redirect(`${req.baseUrl}`);
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

				const documentCount = await $tx.document.count({
					where: {
						SubCategory: {
							Category: {
								id: documentTypeId
							}
						},
						Case: {
							reference: req.session.caseReference
						}
					}
				});

				if (documentCount === 0) {
					await $tx.case.update({
						where: { reference: req.session.caseReference },
						data: { [`${kebabCaseToCamelCase(documentTypeId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED }
					});
				}
			});
		} catch (error) {
			logger.error({ error, documentId }, `Error deleting file: ${documentId} from database`);
			throw new Error('Failed to delete file from database');
		}

		res.redirect(req.baseUrl);
	};
}

export function buildDownloadDocumentController(service: PortalService): AsyncRequestHandler {
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
			const downloadResponse = await blobStore?.downloadBlob(blobName);

			res.setHeader('Content-Type', downloadResponse?.contentType || 'application/octet-stream');
			res.setHeader('Content-Length', downloadResponse?.contentLength || 0);
			res.setHeader('Content-Disposition', `inline; filename="${blobName}"`);

			const downloadStream = downloadResponse?.readableStreamBody;

			downloadStream?.on('error', (err) => {
				if (err?.name === 'AbortError') {
					logger.debug({ documentId }, 'file download cancelled');
				} else {
					logger.error({ err, documentId }, 'file download stream error');
				}
				res.destroy(err);
			});

			downloadStream?.pipe(res);
		} catch (error) {
			logger.error({ error, blobName }, `Error downloading file: ${blobName} from Blob store`);
			throw new Error('Failed to download file from blob store');
		}
	};
}

export function isFileUploadSectionCompletedController(service: PortalService, journeyId: string): AsyncRequestHandler {
	return async (req, res) => {
		const { db } = service;

		const sectionCompletedFieldName = `${kebabCaseToCamelCase(journeyId)}IsCompleted`;
		const isSectionCompleted = req.body[sectionCompletedFieldName];

		const handleTaskCompletedError = async (message: string) => {
			req.body.errors = {
				[sectionCompletedFieldName]: { msg: message }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const fileUploadHomePage = buildFileUploadHomePage(service, journeyId, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return fileUploadHomePage(req, res);
		};

		if (!isSectionCompleted) {
			return handleTaskCompletedError('Select yes if you have completed this section');
		}

		const caseDocuments = await db.document.findMany({
			where: {
				Case: {
					reference: req.session.caseReference
				}
			}
		});

		const affectedDocuments = caseDocuments
			.filter((document) => document.scanResultId === SCAN_RESULT_ID.AFFECTED)
			.map((document) => document.fileName);
		if (affectedDocuments.length > 0 && isSectionCompleted === BOOLEAN_OPTIONS.YES) {
			const fileUploadHomePage = buildFileUploadHomePage(service, journeyId, {
				errors: {
					[sectionCompletedFieldName]: {
						msg: 'Uploaded files have failed virus scan. Remove the affected file and upload a different version.'
					}
				},
				errorSummary: affectedDocuments.map((fileName) => {
					return {
						text: `${fileName} contains a virus. Remove the file and upload a different version.`,
						href: `#${sectionCompletedFieldName}`
					};
				})
			});
			return fileUploadHomePage(req, res);
		}

		const awaitingScanCount = caseDocuments.reduce(
			(count, document) => (document.scanResultId === SCAN_RESULT_ID.PENDING ? count + 1 : count),
			0
		);
		if (awaitingScanCount > 0 && isSectionCompleted === BOOLEAN_OPTIONS.YES) {
			return handleTaskCompletedError('We are still scanning files for viruses');
		}

		const statusId: string =
			isSectionCompleted === BOOLEAN_OPTIONS.YES
				? DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
				: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS;

		await db.case.update({
			where: { reference: req.session.caseReference },
			data: { [`${kebabCaseToCamelCase(journeyId)}StatusId`]: statusId }
		});

		res.redirect('/');
	};
}
