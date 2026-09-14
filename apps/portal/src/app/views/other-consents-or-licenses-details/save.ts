import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@planning-inspectorate/core/util';
import { BOOLEAN_OPTIONS, clearDataFromSession } from '@planning-inspectorate/dynamic-forms';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { notFoundHandler } from '@planning-inspectorate/core/middleware';
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

		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const categories: CategoryInformation[] = [
					{
						key: 'otherConsentsDocuments',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
					}
				];

				await deleteSubCategorySupportingEvidence($tx, caseId, categories);

				if (answers.hasOtherConsents === BOOLEAN_OPTIONS.YES) {
					for (const { key, subCategoryId } of categories) {
						const ids = answers[key]?.split(',') ?? [];
						for (const documentId of ids) {
							await saveSupportingEvidence($tx, caseId, documentId, subCategoryId);
						}
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						otherConsentsDescription:
							answers.hasOtherConsents === BOOLEAN_OPTIONS.YES ? answers.otherConsentsDescription || '' : '',
						[`${kebabCaseToCamelCase(applicationSectionId)}Status`]: {
							connect: { id: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
						}
					}
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving other consents or licences data to database');
			throw new Error('error saving other consents or licences journey', { cause: error });
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
