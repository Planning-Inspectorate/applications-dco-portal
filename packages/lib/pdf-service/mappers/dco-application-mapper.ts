import {
	DOCUMENT_SUB_CATEGORY,
	DOCUMENT_SUB_CATEGORY_ID,
	DOCUMENT_CATEGORY,
	OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { FullCase, SupportingEvidenceWithDocument } from '../types.js';

export const mapCaseToDcoApplication = (caseData: FullCase) => {
	caseData = caseData || {};

	//group evidence into categories to reduce lookup time
	const evidenceByCategory = DOCUMENT_CATEGORY.reduce((acc: Record<string, SupportingEvidenceWithDocument[]>, curr) => {
		acc[curr.id] = findSupportingEvidenceByCategory(caseData?.SupportingEvidence, curr.id);
		return acc;
	}, {});
	//other plans and reports section prompts supporting evidence from multiple categories
	const otherPlansAndReportsCategories = [
		...evidenceByCategory['application-form-related-information'],
		...evidenceByCategory['plans-and-drawings'],
		...evidenceByCategory['reports-and-statements'],
		...evidenceByCategory['other-documents']
	];

	const documentFilenamesByCategory = Object.keys(evidenceByCategory).reduce(
		(acc: Record<string, string[]>, categoryId) => {
			acc[categoryId] = evidenceByCategory[categoryId].map((evidence) => evidence.Document.fileName);
			return acc;
		},
		{}
	);

	const data = {
		caseReference: caseData.reference,
		application: {
			applicantAgentDetails: mapApplicantAgentDetails(caseData),
			aboutTheProject: mapAboutTheProject(caseData, evidenceByCategory['reports-and-statements']),
			infrastructureSpecificAdditionalInformation: mapInfrastructureSpecificAdditionalInformation(
				caseData,
				evidenceByCategory['additional-prescribed-information']
			),
			consultationAndPublicityDetails: mapConsultationAndPublicityDetails(evidenceByCategory['consultation-report']),
			crownLandAccessAndRightsOfWayPlans: mapCrownLandAccessAndRightsOfWayPlans(
				evidenceByCategory['plans-and-drawings']
			),
			draftOrderAndExplanatoryMemorandum: mapDraftOrderAndExplanatoryMemorandum(evidenceByCategory['draft-dco']),
			environmentalImpactAssessment: mapEnvironmentalImpactAssessment(
				caseData,
				evidenceByCategory['environmental-statement']
			),
			floodRiskInformation: mapFloodRiskInformation(evidenceByCategory['environmental-statement']),
			habitatRegulationsAssessmentInformation: mapHabitatRegulationsAssessmentInformation(
				evidenceByCategory['reports-and-statements']
			),
			landAndWorksPlans: mapLandAndWorksPlans(evidenceByCategory['plans-and-drawings']),
			landRightsInformation: mapLandRightsInformation(evidenceByCategory['compulsory-acquisition-information']),
			natureConservationAndEnvironmentalInformation: mapNatureConservationAndEnvironmentalInformation(
				evidenceByCategory['plans-and-drawings']
			),
			otherConsentsOrLicenses: mapOtherConsentsOrLicenses(caseData, evidenceByCategory['reports-and-statements']),
			otherPlansAndReports: mapOtherPlansAndReports(otherPlansAndReportsCategories),
			statutoryNuisanceInformation: mapStatutoryNuisanceInformation(evidenceByCategory['reports-and-statements'])
		},
		documents: documentFilenamesByCategory
	};

	return data;
};

function findSupportingEvidenceByCategory(
	supportingEvidence: SupportingEvidenceWithDocument[],
	categoryId: string
): SupportingEvidenceWithDocument[] {
	const evidence = supportingEvidence || [];
	return evidence.filter((evidence) => {
		const evidenceSubcategory = DOCUMENT_SUB_CATEGORY.find((cat) => cat.id === evidence.subCategoryId);
		return evidenceSubcategory?.categoryId === categoryId;
	});
}

function findSupportingEvidenceBySubcategory(
	supportingEvidence: SupportingEvidenceWithDocument[],
	subCategoryIds: string[]
) {
	const evidence = supportingEvidence || [];
	return evidence.filter((evidence) => subCategoryIds.includes(evidence.subCategoryId)) || [];
}

function mapApplicantAgentDetails(caseData: FullCase) {
	return {
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
		isAgent: !!caseData.AgentDetails,
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
	};
}

function mapAboutTheProject(caseData: FullCase, reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const associatedDevelopments = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT
	]);

	return {
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
		linearEndNorthing: caseData.ProjectLinearSite?.endNorthing,
		hasAssociatedDevelopments: associatedDevelopments.length > 0,
		associatedDevelopments: associatedDevelopments.map((evidence) => evidence.Document.fileName)
	};
}

function mapInfrastructureSpecificAdditionalInformation(
	caseData: FullCase,
	additionalPrescribedInformationEvidence: SupportingEvidenceWithDocument[]
) {
	const nonOffshoreEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION
	]);
	const offshoreEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION
	]);
	const highwayEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT
	]);
	const railwayEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT
	]);
	const harbourEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES
	]);
	const pipelinesEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.PIPELINES
	]);
	const hazardousWasteEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY
	]);
	const damsAndReservoirsEvidence = findSupportingEvidenceBySubcategory(additionalPrescribedInformationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR
	]);

	return {
		hasAdditionalInformation: caseData.infrastructureAdditionalInformationDescription ? true : false,
		additionalInformationDescription: caseData.infrastructureAdditionalInformationDescription,
		nonOffshoreGeneratingStation: {
			electricityGrid: caseData.NonOffshoreGeneratingStation?.electricityGrid,
			gasFuelledGeneratingStation: caseData.NonOffshoreGeneratingStation?.gasFuelledGeneratingStation,
			gasPipelineConnection: caseData.NonOffshoreGeneratingStation?.gasPipelineConnection,
			supportingEvidence: nonOffshoreEvidence.map((evidence) => evidence.Document.fileName)
		},
		offshoreGeneratingStation: {
			cableInstallation: caseData.OffshoreGeneratingStation?.cableInstallation,
			safetyZones: caseData.OffshoreGeneratingStation?.safetyZones,
			supportingEvidence: offshoreEvidence.map((evidence) => evidence.Document.fileName)
		},
		highwayRelatedDevelopment: {
			groundLevels: caseData.HighwayRelatedDevelopment?.groundLevels,
			bridgeHeights: caseData.HighwayRelatedDevelopment?.bridgeHeights,
			tunnelDepths: caseData.HighwayRelatedDevelopment?.tunnelDepths,
			tidalWaterLevels: caseData.HighwayRelatedDevelopment?.tidalWaterLevels,
			heightOfStructures: caseData.HighwayRelatedDevelopment?.heightOfStructures,
			drainageOutfallDetails: caseData.HighwayRelatedDevelopment?.drainageOutfallDetails,
			supportingEvidence: highwayEvidence.map((evidence) => evidence.Document.fileName)
		},
		railwayDevelopment: {
			groundLevels: caseData.RailwayDevelopment?.groundLevels,
			bridgeHeights: caseData.RailwayDevelopment?.bridgeHeights,
			tunnelDepths: caseData.RailwayDevelopment?.tunnelDepths,
			tidalWaterLevels: caseData.RailwayDevelopment?.tidalWaterLevels,
			heightOfStructures: caseData.RailwayDevelopment?.heightOfStructures,
			drainageOutfallDetails: caseData.RailwayDevelopment?.drainageOutfallDetails,
			supportingEvidence: railwayEvidence.map((evidence) => evidence.Document.fileName)
		},
		harbourFacilities: {
			whyHarbourOrderNeeded: caseData.HarbourFacilities?.whyHarbourOrderNeeded,
			benefitsToSeaTransport: caseData.HarbourFacilities?.benefitsToSeaTransport,
			supportingEvidence: harbourEvidence.map((evidence) => evidence.Document.fileName)
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
			landRightsCrossingConsentsAgreement: caseData.Pipelines?.landRightsCrossingConsentsAgreement,
			supportingEvidence: pipelinesEvidence.map((evidence) => evidence.Document.fileName)
		},
		hazardousWasteFacility: {
			whyIsFacilityNeeded: caseData.HazardousWasteFacility?.whyIsFacilityNeeded,
			annualCapacity: caseData.HazardousWasteFacility?.annualCapacity,
			supportingEvidence: hazardousWasteEvidence.map((evidence) => evidence.Document.fileName)
		},
		damOrReservoir: {
			recreationalAmenities: caseData.DamOrReservoir?.recreationalAmenities,
			recreationalAmenitiesDescription: caseData.DamOrReservoir?.recreationalAmenitiesDescription,
			supportingEvidence: damsAndReservoirsEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapConsultationAndPublicityDetails(consultationEvidence: SupportingEvidenceWithDocument[]) {
	const consultationReportEvidence = findSupportingEvidenceBySubcategory(consultationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
	]);
	const consultationAppendicesEvidence = findSupportingEvidenceBySubcategory(consultationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
	]);

	return {
		consultationReport: consultationReportEvidence.map((evidence) => evidence.Document.fileName),
		consultationReportAppendices: consultationAppendicesEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapCrownLandAccessAndRightsOfWayPlans(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const crownLandEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN
	]);
	const accessPlanEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
	]);

	return {
		hasCrownLand: crownLandEvidence.length > 0,
		crownLandPlans: crownLandEvidence.map((evidence) => evidence.Document.fileName),
		hasMeansOfAccess: accessPlanEvidence.length > 0,
		accessAndRightsOfWayPlans: accessPlanEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapDraftOrderAndExplanatoryMemorandum(draftDcoEvidence: SupportingEvidenceWithDocument[]) {
	const draftDcoOrderEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
	]);
	const siValidationEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
	]);
	const explanatoryMemorandumEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM
	]);

	return {
		draftDevelopmentConsentOrder: draftDcoOrderEvidence.map((evidence) => evidence.Document.fileName),
		siValidationReportSuccessEmail: siValidationEvidence.map((evidence) => evidence.Document.fileName),
		explanatoryMemorandum: explanatoryMemorandumEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapEnvironmentalImpactAssessment(
	caseData: FullCase,
	environmentalStatementEvidence: SupportingEvidenceWithDocument[]
) {
	const nonTechnicalSummaryEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY
	]);
	const screeningEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION
	]);
	const scopingEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION
	]);
	const introductoryChaptersEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS
	]);
	const aspectChaptersEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS
	]);
	const statementAppendicesEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES
	]);
	const statementFiguresEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES
	]);
	const modelInfoEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION
	]);
	const anyOtherMediaInfoEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
	]);
	const confidentialEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS
	]);
	const sensitiveInfoEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION
	]);

	return {
		hasEnvironmentalStatement: !!caseData.notifiedOtherPeople,
		nonTechnicalSummary: nonTechnicalSummaryEvidence.map((evidence) => evidence.Document.fileName),
		hasScreeningDirection: screeningEvidence.length > 0,
		screeningDirectionDocuments: screeningEvidence.map((evidence) => evidence.Document.fileName),
		hasScopingOpinion: scopingEvidence.length > 0,
		scopingOpinionDocuments: scopingEvidence.map((evidence) => evidence.Document.fileName),
		introductoryChapters: introductoryChaptersEvidence.map((evidence) => evidence.Document.fileName),
		aspectChapters: aspectChaptersEvidence.map((evidence) => evidence.Document.fileName),
		environmentalStatementAppendices: statementAppendicesEvidence.map((evidence) => evidence.Document.fileName),
		environmentalStatementFigures: statementFiguresEvidence.map((evidence) => evidence.Document.fileName),
		modelInformation: modelInfoEvidence.map((evidence) => evidence.Document.fileName),
		anyOtherMediaInformation: anyOtherMediaInfoEvidence.map((evidence) => evidence.Document.fileName),
		confidentialDocuments: confidentialEvidence.map((evidence) => evidence.Document.fileName),
		sensitiveInformation: sensitiveInfoEvidence.map((evidence) => evidence.Document.fileName),
		notifyingOtherPeople: !!caseData.notifiedOtherPeople
	};
}

function mapFloodRiskInformation(environmentalStatementEvidence: SupportingEvidenceWithDocument[]) {
	const floodRiskAssessmentEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT
	]);

	return {
		hasFloodRiskAssessment: floodRiskAssessmentEvidence.length > 0,
		floodRiskAssessment: floodRiskAssessmentEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapHabitatRegulationsAssessmentInformation(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const habitatRegulationsEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
	]);
	const reportToInformEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT
	]);

	return {
		hasHabitatRegulationsAssessmentReport: habitatRegulationsEvidence.length > 0,
		habitatRegulationsAssessmentReport: habitatRegulationsEvidence.map((evidence) => evidence.Document.fileName),
		hasReportToInformAppropriateAssessment: reportToInformEvidence.length > 0,
		reportToInformAppropriateAssessment: reportToInformEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapLandAndWorksPlans(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const landPlansEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS
	]);
	const worksPlansEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN
	]);

	return {
		landPlans: landPlansEvidence.map((evidence) => evidence.Document.fileName),
		worksPlans: worksPlansEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapLandRightsInformation(compulsoryAcquisitionEvidence: SupportingEvidenceWithDocument[]) {
	const statementOfReasonsEvidence = findSupportingEvidenceBySubcategory(compulsoryAcquisitionEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS
	]);
	const fundingStatementEvidence = findSupportingEvidenceBySubcategory(compulsoryAcquisitionEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT
	]);
	const bookOfReferenceEvidence = findSupportingEvidenceBySubcategory(compulsoryAcquisitionEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5
	]);
	const negotiationsTrackerEvidence = findSupportingEvidenceBySubcategory(compulsoryAcquisitionEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER
	]);

	return {
		compulsoryAcquisition: statementOfReasonsEvidence.length > 0,
		statementOfReasons: statementOfReasonsEvidence.map((evidence) => evidence.Document.fileName),
		fundingStatement: fundingStatementEvidence.map((evidence) => evidence.Document.fileName),
		bookOfReference: bookOfReferenceEvidence.map((evidence) => evidence.Document.fileName),
		landAndRightsNegotiationsTracker: negotiationsTrackerEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapNatureConservationAndEnvironmentalInformation(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const naturalEnvironmentEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
	]);
	const historicEnvironmentEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES
	]);

	return {
		hasNaturalEnvironmentInformation: naturalEnvironmentEvidence.length > 0,
		naturalEnvironmentInformation: naturalEnvironmentEvidence.map((evidence) => evidence.Document.fileName),
		hasHistoricEnvironmentInformation: historicEnvironmentEvidence.length > 0,
		historicEnvironmentInformation: historicEnvironmentEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapOtherConsentsOrLicenses(
	caseData: FullCase,
	reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]
) {
	const otherConsentsEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
	]);

	return {
		hasOtherConsents: !!caseData.otherConsentsDescription,
		otherConsentsDescription: caseData.otherConsentsDescription,
		otherConsentsDocuments: otherConsentsEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapOtherPlansAndReports(otherPlansAndReportsEvidence: SupportingEvidenceWithDocument[]) {
	const otherPlansDrawingsSectionsEvidence = findSupportingEvidenceBySubcategory(
		otherPlansAndReportsEvidence,
		OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS['plans-drawings-sections']
	);
	const otherInformationEvidence = findSupportingEvidenceBySubcategory(
		otherPlansAndReportsEvidence,
		OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS['other-information']
	);

	return {
		otherPlansDrawingsSections: otherPlansDrawingsSectionsEvidence.map((evidence) => evidence.Document.fileName),
		otherInformation: otherInformationEvidence.map((evidence) => evidence.Document.fileName)
	};
}

function mapStatutoryNuisanceInformation(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const statutoryNuisanceEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT
	]);

	return {
		hasStatutoryNuisanceStatement: statutoryNuisanceEvidence.length > 0,
		statutoryNuisanceStatement: statutoryNuisanceEvidence.map((evidence) => evidence.Document.fileName)
	};
}
