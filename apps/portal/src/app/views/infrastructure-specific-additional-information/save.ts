import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { CategoryInformation } from '../supporting-evidence/types.d.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { deleteSubCategorySupportingEvidence, saveSupportingEvidence } from '../supporting-evidence/db-operations.ts';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});
		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const answers = getAnswersFromRes(res);
		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const additionalInformationDocuments = answers.additionalInformationDocuments || [];
				const categories: CategoryInformation[] = [
					{
						key: 'nonOffshoreGeneratingStation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'offshoreGeneratingStation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'highwayRelatedDevelopment',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'railwayDevelopment',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'harbourFacilities',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'anyOtherMediaInformation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'pipelines',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PIPELINES,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.PIPELINES) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'hazardousWasteFacility',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'damOrReservoir',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR,
						applied:
							additionalInformationDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR) &&
							answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES
					}
				];

				await deleteSubCategorySupportingEvidence($tx, caseId, categories);

				for (const { key, subCategoryId, applied } of categories) {
					if (!applied) continue;
					const ids = answers[key]?.split(',') ?? [];
					for (const documentId of ids) {
						await saveSupportingEvidence($tx, caseId, documentId, subCategoryId);
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						infrastructureAdditionalInformationDescription: answers.additionalInformationDescription || null,
						notifiedOtherPeople: answers.notifyingOtherPeople === BOOLEAN_OPTIONS.YES ? true : false,
						[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
					}
				});
			});
		} catch (error) {
			console.log(error);
			logger.error({ error }, 'error saving infrastructure specific additional information data to database');
			throw new Error('error saving infrastructure specific additional information journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
