import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { CategoryInformation } from '../supporting-evidence/types.d.ts';
import { deleteSubCategorySupportingEvidence, saveSupportingEvidence } from '../supporting-evidence/db-operations.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const categories: CategoryInformation[] = [
					{
						key: 'habitatRegulationsAssessmentScreeningReport',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
					}
				];

				await deleteSubCategorySupportingEvidence($tx, caseId, categories);

				if (answers.hasHabitatRegulationsAssessmentReport === BOOLEAN_OPTIONS.YES) {
					const ids = (answers['habitatRegulationsAssessmentScreeningReport'] ?? '').split(',').filter(Boolean);
					for (const documentId of ids) {
						await saveSupportingEvidence(
							$tx,
							caseId,
							documentId,
							DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
						);
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: { [`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving habitat regulations assessment information data to database');
			throw new Error('error saving habitat regulations assessment information journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
