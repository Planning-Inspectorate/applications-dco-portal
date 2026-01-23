import { DOCUMENT_SUB_CATEGORY, DOCUMENT_CATEGORY } from 'packages/database/src/seed/data-static.ts';
import type { FullCase } from '../types.js';
import { SupportingEvidence } from 'packages/database/src/client/client.ts';

export const mapCaseToDcoApplication = (caseData: FullCase) => {
	caseData = caseData || {};

	//in progress
	const evidenceByCategory = DOCUMENT_CATEGORY.reduce((acc: Record<string, any>, curr) => {
		acc[curr.id] = findSupportingEvidenceByCategory(caseData?.SupportingEvidence, curr.id);
		return acc;
	}, {});

	const data = {
		caseReference: caseData.reference,
		application: {
			applicantAgentDetails: {
				applicantOrganisation: caseData.ApplicantDetails?.organisation,
				applicantFirstName: caseData.ApplicantDetails?.firstName,
				applicantLastName: caseData.ApplicantDetails?.lastName,
				applicantEmail: caseData.ApplicantDetails?.emailAddress,
				applicantPhone: caseData.ApplicantDetails?.phone,
				applicantAddressLine1: caseData.ApplicantDetails?.Address?.addressLine1,
				applicantAddressLine2: caseData.ApplicantDetails?.Address?.addressLine2,
				applicantTownCity: caseData.ApplicantDetails?.Address?.townCity,
				applicantCounty: caseData.ApplicantDetails?.Address?.county,
				applicantCountry: caseData.ApplicantDetails?.Address?.country,
				agentOrganisation: caseData.AgentDetails?.organisation,
				agentFirstName: caseData.AgentDetails?.firstName,
				agentLastName: caseData.AgentDetails?.lastName,
				agentEmail: caseData.AgentDetails?.emailAddress,
				agentPhone: caseData.AgentDetails?.phone,
				agentAddressLine1: caseData.AgentDetails?.Address?.addressLine1,
				agentAddressLine2: caseData.AgentDetails?.Address?.addressLine2,
				agentTownCity: caseData.AgentDetails?.Address?.townCity,
				agentCounty: caseData.AgentDetails?.Address?.county,
				agentCountry: caseData.AgentDetails?.Address?.country,
				paymentMethod: caseData.CasePaymentMethod?.displayName
			},
			aboutTheProject: {
				projectDescription: caseData.projectDescription,
				projectConsentReason: caseData.projectConsentReason,
				locationDescription: caseData.locationDescription,
				singleOrLinear: caseData.ProjectSingleSite ? 'Single' : 'Linear',
				singleEasting: caseData.ProjectSingleSite?.easting,
				singleNorthing: caseData.ProjectSingleSite?.northing,
				linearStartEasting: caseData.ProjectLinearSite?.startEasting,
				linearStartNorthing: caseData.ProjectLinearSite?.startNorthing,
				linearMiddleNorthing: caseData.ProjectLinearSite?.middleNorthing,
				linearMiddleEasting: caseData.ProjectLinearSite?.middleEasting,
				linearEndEasting: caseData.ProjectLinearSite?.endEasting,
				linearEndNorthing: caseData.ProjectLinearSite?.endNorthing
			},
			infrastructureSpecificAdditionalInformation: {
				description: caseData.infrastructureAdditionalInformationDescription,
				nonOffshoreGeneratingStation: {
					electricityGrid: caseData.NonOffshoreGeneratingStation?.electricityGrid,
					gasFuelledGeneratingStation: caseData.NonOffshoreGeneratingStation?.gasFuelledGeneratingStation,
					gasPipelineConnection: caseData.NonOffshoreGeneratingStation?.gasPipelineConnection
				},
				offshoreGeneratingStation: {
					cableInstallation: caseData.OffshoreGeneratingStation?.cableInstallation,
					safetyZones: caseData.OffshoreGeneratingStation?.safetyZones
				},
				highwayRelatedDevelopment: {
					groundLevels: caseData.HighwayRelatedDevelopment?.groundLevels,
					bridgeHeights: caseData.HighwayRelatedDevelopment?.bridgeHeights,
					tunnelDepths: caseData.HighwayRelatedDevelopment?.tunnelDepths,
					tidalWaterLevels: caseData.HighwayRelatedDevelopment?.tidalWaterLevels,
					heightOfStructures: caseData.HighwayRelatedDevelopment?.heightOfStructures,
					drainageOutfallDetails: caseData.HighwayRelatedDevelopment?.drainageOutfallDetails
				},
				railwayDevelopment: {
					groundLevels: caseData.RailwayDevelopment?.groundLevels,
					bridgeHeights: caseData.RailwayDevelopment?.bridgeHeights,
					tunnelDepths: caseData.RailwayDevelopment?.tunnelDepths,
					tidalWaterLevels: caseData.RailwayDevelopment?.tidalWaterLevels,
					heightOfStructures: caseData.RailwayDevelopment?.heightOfStructures,
					drainageOutfallDetails: caseData.RailwayDevelopment?.drainageOutfallDetails
				},
				harbourFacilities: {
					whyHarbourOrderNeeded: caseData.HarbourFacilities?.whyHarbourOrderNeeded,
					benefitsToSeaTransport: caseData.HarbourFacilities?.benefitsToSeaTransport
				},
				pipelines: {
					name: caseData.Pipelines?.name,
					owner: caseData.Pipelines?.owner,
					startPoint: caseData.Pipelines?.startPoint,
					endPoint: caseData.Pipelines?.endPoint,
					length: caseData.Pipelines?.length,
					externalDiameter: caseData.Pipelines?.externalDiameter,
					conveyance: caseData.Pipelines?.conveyance,
					landRightsCrossingConsents: caseData.Pipelines?.landRightsCrossingConsents,
					landRightsCrossingConsentsAgreement: caseData.Pipelines?.landRightsCrossingConsentsAgreement
				},
				hazardousWasteFacility: {
					whyIsFacilityNeeded: caseData.HazardousWasteFacility?.whyIsFacilityNeeded,
					annualCapacity: caseData.HazardousWasteFacility?.annualCapacity
				},
				damOrReservoir: {
					recreationalAmenities: caseData.DamOrReservoir?.recreationalAmenities,
					recreationalAmenitiesDescription: caseData.DamOrReservoir?.recreationalAmenitiesDescription
				}
			},
			otherConsentsOrLicenses: {
				hasOtherConsents: caseData.otherConsentsDescription ? true : false,
				otherConsentsDescription: caseData.otherConsentsDescription
			}
		}
	};

	return data;
};

function findSupportingEvidenceByCategory(supportingEvidence: SupportingEvidence[], categoryId: string) {
	return (supportingEvidence || []).filter((evidence) => {
		const evidenceSubcategory = DOCUMENT_SUB_CATEGORY.find((cat) => cat.id === evidence.subCategoryId);
		return evidenceSubcategory?.categoryId === categoryId;
	});
}
