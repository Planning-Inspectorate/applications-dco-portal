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
import {
	mapAnswersToHighwayRelatedDevelopment,
	mapAnswersToNonOffshoreGeneratingStation,
	mapAnswersToOffshoreGeneratingStation,
	mapAnswersToRailwayDevelopment,
	mapAnswersToHarbourFacilities,
	mapAnswersToPipelines,
	mapAnswersToHazardousWasteFacility,
	mapAnswersToDamOrReservoir
} from './mappers.ts';
import { getInfrastructureSpecificAdditionalInformationSubcategoryOptions } from './util.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference },
			include: {
				NonOffshoreGeneratingStation: true,
				OffshoreGeneratingStation: true,
				HighwayRelatedDevelopment: true,
				RailwayDevelopment: true,
				HarbourFacilities: true,
				Pipelines: true,
				HazardousWasteFacility: true,
				DamOrReservoir: true
			}
		});
		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const answers = getAnswersFromRes(res);

		const additionalPrescribedInformationSubcategoryIds =
			getInfrastructureSpecificAdditionalInformationSubcategoryOptions().map((option) => option.id);
		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const additionalInformationDocuments = answers.additionalInformationDocuments || [];
				const documentAppliedLookup: Record<string, any> = {};
				for (const id of additionalPrescribedInformationSubcategoryIds) {
					documentAppliedLookup[id] =
						(id === DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION
							? /(?:^|,)\s*(?<!non-)offshore-generating-station\s*(?=,|$)/.test(additionalInformationDocuments)
							: additionalInformationDocuments.includes(id)) &&
						answers.hasAdditionalInformation === BOOLEAN_OPTIONS.YES;
				}

				const categories: CategoryInformation[] = [
					{
						key: 'nonOffshoreGeneratingStation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION]
					},
					{
						key: 'offshoreGeneratingStation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION]
					},
					{
						key: 'highwayRelatedDevelopment',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT]
					},
					{
						key: 'railwayDevelopment',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT]
					},
					{
						key: 'harbourFacilities',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES]
					},
					{
						key: 'anyOtherMediaInformation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION]
					},
					{
						key: 'pipelines',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PIPELINES,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.PIPELINES]
					},
					{
						key: 'hazardousWasteFacility',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY]
					},
					{
						key: 'damOrReservoir',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR,
						applied: documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR]
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

				// Conditionally building case update query handles updating/deleting relation models with minimal queries
				const data = {
					infrastructureAdditionalInformationDescription: answers.additionalInformationDescription || null,
					notifiedOtherPeople: answers.notifyingOtherPeople === BOOLEAN_OPTIONS.YES ? true : false,
					[`${kebabCaseToCamelCase(applicationSectionId)}Status`]: {
						connect: { id: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
					}
				};
				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION]) {
					data.NonOffshoreGeneratingStation = buildUpsertQuery(
						mapAnswersToNonOffshoreGeneratingStation(answers, caseId)
					);
				} else if (caseData?.NonOffshoreGeneratingStation) {
					await $tx.nonOffshoreGeneratingStation.delete({
						where: { id: caseData?.NonOffshoreGeneratingStation?.id }
					});
				}
				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION]) {
					data.OffshoreGeneratingStation = buildUpsertQuery(mapAnswersToOffshoreGeneratingStation(answers, caseId));
				} else if (caseData?.OffshoreGeneratingStation) {
					await $tx.offshoreGeneratingStation.delete({
						where: { id: caseData?.OffshoreGeneratingStation?.id }
					});
				}
				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION]) {
					data.OffshoreGeneratingStation = buildUpsertQuery(mapAnswersToOffshoreGeneratingStation(answers, caseId));
				} else {
					if (caseData?.OffshoreGeneratingStation) {
						await $tx.offshoreGeneratingStation.delete({
							where: { id: caseData?.OffshoreGeneratingStation?.id }
						});
					}
				}
				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT]) {
					data.HighwayRelatedDevelopment = buildUpsertQuery(mapAnswersToHighwayRelatedDevelopment(answers, caseId));
				} else {
					if (caseData?.HighwayRelatedDevelopment) {
						await $tx.highwayRelatedDevelopment.delete({
							where: { id: caseData?.HighwayRelatedDevelopment?.id }
						});
					}
				}

				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT]) {
					data.RailwayDevelopment = buildUpsertQuery(mapAnswersToRailwayDevelopment(answers, caseId));
				} else {
					if (caseData?.RailwayDevelopment) {
						await $tx.railwayDevelopment.delete({
							where: { id: caseData?.RailwayDevelopment?.id }
						});
					}
				}

				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES]) {
					data.HarbourFacilities = buildUpsertQuery(mapAnswersToHarbourFacilities(answers, caseId));
				} else {
					if (caseData?.HarbourFacilities) {
						await $tx.harbourFacilities.delete({
							where: { id: caseData?.HarbourFacilities?.id }
						});
					}
				}

				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.PIPELINES]) {
					data.Pipelines = buildUpsertQuery(mapAnswersToPipelines(answers, caseId));
				} else {
					if (caseData?.Pipelines) {
						await $tx.pipelines.delete({
							where: { id: caseData?.Pipelines?.id }
						});
					}
				}

				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY]) {
					data.HazardousWasteFacility = buildUpsertQuery(mapAnswersToHazardousWasteFacility(answers, caseId));
				} else {
					if (caseData?.HazardousWasteFacility) {
						await $tx.hazardousWasteFacility.delete({
							where: { id: caseData?.HazardousWasteFacility?.id }
						});
					}
				}

				if (documentAppliedLookup[DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR]) {
					data.DamOrReservoir = buildUpsertQuery(mapAnswersToDamOrReservoir(answers, caseId));
				} else {
					if (caseData?.DamOrReservoir) {
						await $tx.damOrReservoir.delete({
							where: { id: caseData?.DamOrReservoir?.id }
						});
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: data
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving infrastructure specific additional information data to database');
			throw new Error('error saving infrastructure specific additional information journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}

function buildUpsertQuery(input: Record<string, any>) {
	return {
		upsert: {
			update: {
				...input
			},
			create: {
				...input
			}
		}
	};
}
