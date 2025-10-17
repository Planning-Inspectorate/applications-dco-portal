import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
// @ts-expect-error - due to not having @types
import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';

export function buildFileUploadHomePage(
	{ db }: PortalService,
	documentTypeId: string,
	viewData = {}
): AsyncRequestHandler {
	return async (req, res) => {
		const documentCategory = await db.documentCategory.findUnique({
			where: { id: documentTypeId }
		});

		const caseWithFilteredDocuments = await db.case.findFirst({
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

		const documentRows =
			caseWithFilteredDocuments?.Documents.map((document) => {
				const { fileName, SubCategory, ApfpRegulation, isCertified, uploadedDate } = document;
				return [
					{ html: `<a class="govuk-link" href="#">${fileName}</a>` },
					{ text: SubCategory?.displayName },
					{ text: ApfpRegulation?.displayName },
					{ text: isCertified ? 'Certified' : 'Not certified' },
					{ text: formatDateForDisplay(uploadedDate, { format: 'dd/MM/yyyy HH:mm' }) },
					{ html: '<a class="govuk-link" href="#">Remove</a>' }
				];
			}) || [];

		return res.render('views/file-upload/view.njk', {
			pageTitle: documentCategory?.displayName,
			documentCategory: kebabCaseToCamelCase(documentTypeId),
			documents: documentRows,
			uploadButtonUrl: `${req.baseUrl}/upload/document-type`,
			backLinkUrl: '/',
			...viewData
		});
	};
}

export function buildIsFileUploadSectionCompleted(service: PortalService, documentTypeId: string): AsyncRequestHandler {
	return async (req, res) => {
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

		//TODO: save isSectionComplete value to DB for provided documentTypeId / documentCompletedFieldName

		res.redirect('/');
	};
}
