import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { MultipleCategoryInformation } from '../supporting-evidence/types.d.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import {
	deleteMultipleSubCategorySupportingEvidence,
	saveSupportingEvidence
} from '../supporting-evidence/db-operations.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS, OTHER_INFORMATION_SUBCATEGORY_IDS } from './constants.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference },
			include: {
				Documents: {
					where: {
						SubCategory: {
							id: { in: [...OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS, ...OTHER_INFORMATION_SUBCATEGORY_IDS] }
						}
					}
				}
			}
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const categories: MultipleCategoryInformation[] = [
					{
						key: 'otherPlansDrawingsSections',
						subCategoryIds: OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS
					},
					{
						key: 'otherInformation',
						subCategoryIds: OTHER_INFORMATION_SUBCATEGORY_IDS
					}
				];

				await deleteMultipleSubCategorySupportingEvidence($tx, caseId, categories);

				for (const { key } of categories) {
					const ids = answers[key]?.split(',') ?? [];
					for (const documentId of ids) {
						const fullDocument = caseData.Documents.find((doc) => doc.id === documentId);
						if (!fullDocument) throw new Error(`could not find uploaded document id: ${documentId} in database`);
						await saveSupportingEvidence($tx, caseId, documentId, fullDocument.subCategoryId);
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

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
