import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { CategoryInformation } from '../supporting-evidence/types.d.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { deleteSubCategorySupportingEvidence, saveSupportingEvidence } from '../supporting-evidence/db-operations.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}
		console.log(answers);

		/*
		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const categories: CategoryInformation[] = [
					{
						key: 'draftDevelopmentConsentOrder',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
					},
					{
						key: 'siValidationReportSuccessEmail',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
					},
					{
						key: 'explanatoryMemorandum',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM
					}
				];

				await deleteSubCategorySupportingEvidence($tx, caseId, categories);

				for (const { key, subCategoryId } of categories) {
					const ids = answers[key]?.split(',') ?? [];
					for (const documentId of ids) {
						await saveSupportingEvidence($tx, caseId, documentId, subCategoryId);
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: { [`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving other plans and reports data to database');
			throw new Error('error saving other plans and reports journey');
		}
			*/

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
