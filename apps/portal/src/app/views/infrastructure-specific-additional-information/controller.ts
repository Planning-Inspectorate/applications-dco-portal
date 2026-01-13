import { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getSupportingEvidenceIds } from '../supporting-evidence/util.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import { populateMultiSubcategoryCheckboxes } from '../util.ts';
import { getInfrastructureSpecificAdditionalInformationSubcategoryOptions } from './util.ts';

export function buildInfrastructureSpecificAdditionalInfoHomePage(
	{ db }: PortalService,
	applicationSectionId: string
): AsyncRequestHandler {
	return async (req, res) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (
			(caseData as any)[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`] !==
			DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
		) {
			await populateForm(req, res, db, applicationSectionId);
		}
		res.redirect(`${req.baseUrl}/details/additional-information`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_IDS =
		getInfrastructureSpecificAdditionalInformationSubcategoryOptions().map((option) => option.id);

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_IDS }
					}
				}
			},
			NonOffshoreGeneratingStation: true,
			OffshoreGeneratingStation: true,
			HighwayRelatedDevelopment: true,
			RailwayDevelopment: true,
			HarbourFacilities: true,
			Pipelines: true
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});
	const getEvidenceCount = (subCategoryId: string) => {
		return db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: subCategoryId
			}
		});
	};

	const additionalInfoDocumentCounts = await Promise.all(
		ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_IDS.map(async (subCategoryId: string) => {
			const subCategoryCount = await getEvidenceCount(subCategoryId);
			return { count: subCategoryCount, id: subCategoryId };
		})
	);

	forms[applicationSectionId] = {
		hasAdditionalInformation:
			additionalInfoDocumentCounts.reduce((acc, curr) => (acc += curr.count), 0) > 0 ? 'yes' : 'no',
		additionalInformationDescription: caseData.infrastructureAdditionalInformationDescription || '',
		additionalInformationDocuments: populateMultiSubcategoryCheckboxes(additionalInfoDocumentCounts),
		electricityGrid: caseData.NonOffshoreGeneratingStation?.electricityGrid || '',
		gasFuelledGeneratingStation: caseData.NonOffshoreGeneratingStation?.gasFuelledGeneratingStation ? 'yes' : 'no',
		gasPipelineConnection: caseData.NonOffshoreGeneratingStation?.gasPipelineConnection || '',
		nonOffshoreGeneratingStation: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION
		),
		cableInstallation: caseData.OffshoreGeneratingStation?.cableInstallation || '',
		safetyZones: caseData.OffshoreGeneratingStation?.safetyZones || '',
		offshoreGeneratingStation: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION
		),
		highwayGroundLevels: caseData.HighwayRelatedDevelopment?.groundLevels || '',
		highwayBridgeHeights: caseData.HighwayRelatedDevelopment?.bridgeHeights || '',
		highwayTunnelDepths: caseData.HighwayRelatedDevelopment?.tunnelDepths || '',
		highwayTidalWaterLevels: caseData.HighwayRelatedDevelopment?.tidalWaterLevels || '',
		highwayHeightOfStructures: caseData.HighwayRelatedDevelopment?.heightOfStructures || '',
		highwayDrainageOutfallDetails: caseData.HighwayRelatedDevelopment?.drainageOutfallDetails || '',
		highwayRelatedDevelopment: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT
		),
		railwayGroundLevels: caseData.RailwayDevelopment?.groundLevels || '',
		railwayBridgeHeights: caseData.RailwayDevelopment?.bridgeHeights || '',
		railwayTunnelDepths: caseData.RailwayDevelopment?.tunnelDepths || '',
		railwayTidalWaterLevels: caseData.RailwayDevelopment?.tidalWaterLevels || '',
		railwayHeightOfStructures: caseData.RailwayDevelopment?.heightOfStructures || '',
		railwayDrainageOutfallDetails: caseData.RailwayDevelopment?.drainageOutfallDetails || '',
		railwayDevelopment: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT
		),
		whyHarbourOrderNeeded: caseData.HarbourFacilities?.whyHarbourOrderNeeded || '',
		benefitsToSeaTransport: caseData.HarbourFacilities?.benefitsToSeaTransport || '',
		harbourFacilities: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES
		),
		pipelineName: caseData.Pipelines?.name || '',
		pipelineOwner: caseData.Pipelines?.owner || '',
		pipelineStartPoint: caseData.Pipelines?.startPoint || '',
		pipelineEndPoint: caseData.Pipelines?.endPoint || '',
		pipelineLength: caseData.Pipelines?.length || null,
		pipelineExternalDiameter: caseData.Pipelines?.externalDiameter || null,
		pipelineConveyance: caseData.Pipelines?.conveyance || '',
		landRightsCrossingConsents: caseData.Pipelines?.landRightsCrossingConsents ? 'yes' : 'no',
		landRightsCrossingConsentsAgreement: caseData.Pipelines?.landRightsCrossingConsentsAgreement || '',
		pipelines: getSupportingEvidenceIds(caseData.SupportingEvidence, DOCUMENT_SUB_CATEGORY_ID.PIPELINES),
		hazardousWasteFacility: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY
		),
		damOrReservoir: getSupportingEvidenceIds(caseData.SupportingEvidence, DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR)
	};
}
