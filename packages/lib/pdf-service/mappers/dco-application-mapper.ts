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

	const prettyEvidenceByCategory = DOCUMENT_CATEGORY.reduce((acc: Record<string, string>, curr) => {
		const evidence = evidenceByCategory[curr.id].map((evidence) => evidence.Document.fileName).join(', ');
		acc[curr.displayName] = evidence;
		return acc;
	}, {});

	const data = {
		caseReference: caseData.reference,
		application: {
			applicantAgentDetails: {
				name: 'Applicant and Agent Details',
				data: mapApplicantAgentDetails(caseData)
			},

			aboutTheProject: {
				name: 'About the Project',
				data: mapAboutTheProject(caseData, evidenceByCategory['reports-and-statements'])
			},

			consultationAndPublicityDetails: {
				name: 'Consultation and Publicity Details',
				data: mapConsultationAndPublicityDetails(evidenceByCategory['consultation-report'])
			},

			draftOrderAndExplanatoryMemorandum: {
				name: 'Draft Order and Explanatory Memorandum',
				data: mapDraftOrderAndExplanatoryMemorandum(evidenceByCategory['draft-dco'])
			},

			landAndWorksPlans: {
				name: 'Land and Works Plans',
				data: mapLandAndWorksPlans(evidenceByCategory['plans-and-drawings'])
			},

			landRightsInformation: {
				name: 'Land Rights Information',
				data: mapLandRightsInformation(evidenceByCategory['compulsory-acquisition-information'])
			},

			environmentalImpactAssessment: {
				name: 'Environmental Impact Assessment',
				data: mapEnvironmentalImpactAssessment(caseData, evidenceByCategory['environmental-statement'])
			},

			habitatRegulationsAssessmentInformation: {
				name: 'Habitat Regulations Assessment Information',
				data: mapHabitatRegulationsAssessmentInformation(evidenceByCategory['reports-and-statements'])
			},

			natureConservationAndEnvironmentalInformation: {
				name: 'Nature Conservation and Environmental Information',
				data: mapNatureConservationAndEnvironmentalInformation(evidenceByCategory['plans-and-drawings'])
			},

			floodRiskInformation: {
				name: 'Flood Risk Information',
				data: mapFloodRiskInformation(evidenceByCategory['environmental-statement'])
			},

			statutoryNuisanceInformation: {
				name: 'Statutory Nuisance Information',
				data: mapStatutoryNuisanceInformation(evidenceByCategory['reports-and-statements'])
			},

			crownLandAccessAndRightsOfWayPlans: {
				name: 'Crown Land Access and Rights of Way Plans',
				data: mapCrownLandAccessAndRightsOfWayPlans(evidenceByCategory['plans-and-drawings'])
			},

			infrastructureSpecificAdditionalInformation: {
				name: 'Infrastructure Specific Additional Information',
				data: mapInfrastructureSpecificAdditionalInformation(
					caseData,
					evidenceByCategory['additional-prescribed-information']
				)
			},

			otherConsentsOrLicenses: {
				name: 'Other Consents or Licenses',
				data: mapOtherConsentsOrLicenses(caseData, evidenceByCategory['reports-and-statements'])
			},

			otherPlansAndReports: {
				name: 'Other Plans and Reports',
				data: mapOtherPlansAndReports(otherPlansAndReportsCategories)
			}
		},
		documents: prettyEvidenceByCategory,
		declaration: mapDeclaration(caseData)
	};

	return data;
};

export function findSupportingEvidenceByCategory(
	supportingEvidence: SupportingEvidenceWithDocument[],
	categoryId: string
): SupportingEvidenceWithDocument[] {
	const evidence = supportingEvidence || [];
	return evidence.filter((evidence) => {
		const evidenceSubcategory = DOCUMENT_SUB_CATEGORY.find((cat) => cat.id === evidence.subCategoryId);
		return evidenceSubcategory?.categoryId === categoryId;
	});
}

export function findSupportingEvidenceBySubcategory(
	supportingEvidence: SupportingEvidenceWithDocument[],
	subCategoryIds: string[]
) {
	const evidence = supportingEvidence || [];
	return evidence.filter((evidence) => subCategoryIds.includes(evidence.subCategoryId)) || [];
}

function mapApplicantAgentDetails(caseData: FullCase) {
	return {
		applicantOrganisation: { name: 'Applicant Organisation', value: caseData.ApplicantDetails?.organisation },
		applicantFirstName: { name: 'Applicant First Name', value: caseData.ApplicantDetails?.firstName },
		applicantLastName: { name: 'Applicant Last Name', value: caseData.ApplicantDetails?.lastName },
		applicantEmail: { name: 'Applicant Email', value: caseData.ApplicantDetails?.emailAddress },
		applicantPhone: { name: 'Applicant Phone', value: caseData.ApplicantDetails?.phone },

		applicantAddressLine1: {
			name: 'Applicant Address Line 1',
			value: caseData.ApplicantDetails?.Address?.addressLine1
		},
		applicantAddressLine2: {
			name: 'Applicant Address Line 2',
			value: caseData.ApplicantDetails?.Address?.addressLine2
		},
		applicantTownCity: { name: 'Applicant Town/City', value: caseData.ApplicantDetails?.Address?.townCity },
		applicantCounty: { name: 'Applicant County', value: caseData.ApplicantDetails?.Address?.county },
		applicantCountry: { name: 'Applicant Country', value: caseData.ApplicantDetails?.Address?.country },
		applicantPostcode: { name: 'Applicant Postcode', value: caseData.ApplicantDetails?.Address?.postcode },

		isAgent: { name: 'Is Agent', value: caseData.AgentDetails ? 'Yes' : 'No' },

		agentOrganisation: { name: 'Agent Organisation', value: caseData.AgentDetails?.organisation },
		agentFirstName: { name: 'Agent First Name', value: caseData.AgentDetails?.firstName },
		agentLastName: { name: 'Agent Last Name', value: caseData.AgentDetails?.lastName },
		agentEmail: { name: 'Agent Email', value: caseData.AgentDetails?.emailAddress },
		agentPhone: { name: 'Agent Phone', value: caseData.AgentDetails?.phone },

		agentAddressLine1: { name: 'Agent Address Line 1', value: caseData.AgentDetails?.Address?.addressLine1 },
		agentAddressLine2: { name: 'Agent Address Line 2', value: caseData.AgentDetails?.Address?.addressLine2 },
		agentTownCity: { name: 'Agent Town/City', value: caseData.AgentDetails?.Address?.townCity },
		agentCounty: { name: 'Agent County', value: caseData.AgentDetails?.Address?.county },
		agentCountry: { name: 'Agent Country', value: caseData.AgentDetails?.Address?.country },
		agentPostcode: { name: 'Agent Postcode', value: caseData.AgentDetails?.Address?.postcode },

		paymentMethod: { name: 'Payment Method', value: caseData.CasePaymentMethod?.displayName }
	};
}

function mapAboutTheProject(caseData: FullCase, reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const associatedDevelopments = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT
	]);

	return {
		projectDescription: { name: 'Project Description', value: caseData.projectDescription },
		projectConsentReason: { name: 'Project Consent Reason', value: caseData.projectConsentReason },
		locationDescription: { name: 'Location Description', value: caseData.locationDescription },

		singleOrLinear: {
			name: 'Single or Linear',
			value: caseData.ProjectSingleSite ? 'Single' : 'Linear'
		},

		singleEasting: { name: 'Single Site Easting', value: caseData.ProjectSingleSite?.easting },
		singleNorthing: { name: 'Single Site Northing', value: caseData.ProjectSingleSite?.northing },

		linearStartEasting: { name: 'Linear Start Easting', value: caseData.ProjectLinearSite?.startEasting },
		linearStartNorthing: { name: 'Linear Start Northing', value: caseData.ProjectLinearSite?.startNorthing },
		linearMiddleEasting: { name: 'Linear Middle Easting', value: caseData.ProjectLinearSite?.middleEasting },
		linearMiddleNorthing: { name: 'Linear Middle Northing', value: caseData.ProjectLinearSite?.middleNorthing },
		linearEndEasting: { name: 'Linear End Easting', value: caseData.ProjectLinearSite?.endEasting },
		linearEndNorthing: { name: 'Linear End Northing', value: caseData.ProjectLinearSite?.endNorthing },

		hasAssociatedDevelopments: {
			name: 'Has Associated Developments',
			value: associatedDevelopments.length > 0 ? 'Yes' : 'No'
		},

		associatedDevelopments: {
			name: 'Associated Developments',
			value: associatedDevelopments.map((evidence) => evidence.Document.fileName)
		}
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
		hasAdditionalInformation: {
			name: 'Has Additional Information',
			value: caseData.infrastructureAdditionalInformationDescription ? 'Yes' : 'No'
		},

		additionalInformationDescription: {
			name: 'Additional Information Description',
			value: caseData.infrastructureAdditionalInformationDescription
		},

		nonOffshoreGeneratingStation: {
			name: 'Non-Offshore Generating Station',
			nested: true,
			value: {
				electricityGrid: {
					name: 'Electricity Grid',
					value: caseData.NonOffshoreGeneratingStation?.electricityGrid
				},
				gasFuelledGeneratingStation: {
					name: 'Gas Fuelled Generating Station',
					value: caseData.NonOffshoreGeneratingStation?.gasFuelledGeneratingStation ? 'Yes' : 'No'
				},
				gasPipelineConnection: {
					name: 'Gas Pipeline Connection',
					value: caseData.NonOffshoreGeneratingStation?.gasPipelineConnection
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: nonOffshoreEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		offshoreGeneratingStation: {
			name: 'Offshore Generating Station',
			nested: true,
			value: {
				cableInstallation: {
					name: 'Cable Installation',
					value: caseData.OffshoreGeneratingStation?.cableInstallation
				},
				safetyZones: {
					name: 'Safety Zones',
					value: caseData.OffshoreGeneratingStation?.safetyZones
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: offshoreEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		highwayRelatedDevelopment: {
			name: 'Highway Related Development',
			nested: true,
			value: {
				groundLevels: {
					name: 'Ground Levels',
					value: caseData.HighwayRelatedDevelopment?.groundLevels
				},
				bridgeHeights: {
					name: 'Bridge Heights',
					value: caseData.HighwayRelatedDevelopment?.bridgeHeights
				},
				tunnelDepths: {
					name: 'Tunnel Depths',
					value: caseData.HighwayRelatedDevelopment?.tunnelDepths
				},
				tidalWaterLevels: {
					name: 'Tidal Water Levels',
					value: caseData.HighwayRelatedDevelopment?.tidalWaterLevels
				},
				heightOfStructures: {
					name: 'Height of Structures',
					value: caseData.HighwayRelatedDevelopment?.heightOfStructures
				},
				drainageOutfallDetails: {
					name: 'Drainage Outfall Details',
					value: caseData.HighwayRelatedDevelopment?.drainageOutfallDetails
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: highwayEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		railwayDevelopment: {
			name: 'Railway Development',
			nested: true,
			value: {
				groundLevels: {
					name: 'Ground Levels',
					value: caseData.RailwayDevelopment?.groundLevels
				},
				bridgeHeights: {
					name: 'Bridge Heights',
					value: caseData.RailwayDevelopment?.bridgeHeights
				},
				tunnelDepths: {
					name: 'Tunnel Depths',
					value: caseData.RailwayDevelopment?.tunnelDepths
				},
				tidalWaterLevels: {
					name: 'Tidal Water Levels',
					value: caseData.RailwayDevelopment?.tidalWaterLevels
				},
				heightOfStructures: {
					name: 'Height of Structures',
					value: caseData.RailwayDevelopment?.heightOfStructures
				},
				drainageOutfallDetails: {
					name: 'Drainage Outfall Details',
					value: caseData.RailwayDevelopment?.drainageOutfallDetails
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: railwayEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		harbourFacilities: {
			name: 'Harbour Facilities',
			nested: true,
			value: {
				whyHarbourOrderNeeded: {
					name: 'Why Harbour Order Is Needed',
					value: caseData.HarbourFacilities?.whyHarbourOrderNeeded
				},
				benefitsToSeaTransport: {
					name: 'Benefits to Sea Transport',
					value: caseData.HarbourFacilities?.benefitsToSeaTransport
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: harbourEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		pipelines: {
			name: 'Pipelines',
			nested: true,
			value: {
				name: { name: 'Pipeline Name', value: caseData.Pipelines?.name },
				owner: { name: 'Owner', value: caseData.Pipelines?.owner },
				startPoint: { name: 'Start Point', value: caseData.Pipelines?.startPoint },
				endPoint: { name: 'End Point', value: caseData.Pipelines?.endPoint },
				length: { name: 'Length', value: caseData.Pipelines?.length },
				externalDiameter: { name: 'External Diameter', value: caseData.Pipelines?.externalDiameter },
				conveyance: { name: 'Conveyance', value: caseData.Pipelines?.conveyance },
				landRightsCrossingConsents: {
					name: 'Land Rights Crossing Consents',
					value: caseData.Pipelines?.landRightsCrossingConsents ? 'Yes' : 'No'
				},
				landRightsCrossingConsentsAgreement: {
					name: 'Land Rights Crossing Consents Agreement',
					value: caseData.Pipelines?.landRightsCrossingConsentsAgreement
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: pipelinesEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		hazardousWasteFacility: {
			name: 'Hazardous Waste Facility',
			nested: true,
			value: {
				whyIsFacilityNeeded: {
					name: 'Why the Facility Is Needed',
					value: caseData.HazardousWasteFacility?.whyIsFacilityNeeded
				},
				annualCapacity: {
					name: 'Annual Capacity',
					value: caseData.HazardousWasteFacility?.annualCapacity
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: hazardousWasteEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		damOrReservoir: {
			name: 'Dam or Reservoir',
			nested: true,
			value: {
				recreationalAmenities: {
					name: 'Recreational Amenities',
					value: caseData.DamOrReservoir?.recreationalAmenities ? 'Yes' : 'No'
				},
				recreationalAmenitiesDescription: {
					name: 'Recreational Amenities Description',
					value: caseData.DamOrReservoir?.recreationalAmenitiesDescription
				},
				supportingEvidence: {
					name: 'Supporting Evidence',
					value: damsAndReservoirsEvidence.map((e) => e.Document.fileName)
				}
			}
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
		consultationReport: {
			name: 'Consultation Report',
			value: consultationReportEvidence.map((evidence) => evidence.Document.fileName)
		},

		consultationReportAppendices: {
			name: 'Consultation Report Appendices',
			value: consultationAppendicesEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		hasCrownLand: {
			name: 'Has Crown Land',
			value: crownLandEvidence.length > 0 ? 'Yes' : 'No'
		},

		crownLandPlans: {
			name: 'Crown Land Plans',
			value: crownLandEvidence.map((evidence) => evidence.Document.fileName)
		},

		hasMeansOfAccess: {
			name: 'Has Means of Access',
			value: accessPlanEvidence.length > 0 ? 'Yes' : 'No'
		},

		accessAndRightsOfWayPlans: {
			name: 'Access and Rights of Way Plans',
			value: accessPlanEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		draftDevelopmentConsentOrder: {
			name: 'Draft Development Consent Order',
			value: draftDcoOrderEvidence.map((evidence) => evidence.Document.fileName)
		},

		siValidationReportSuccessEmail: {
			name: 'SI Validation Report Success Email',
			value: siValidationEvidence.map((evidence) => evidence.Document.fileName)
		},

		explanatoryMemorandum: {
			name: 'Explanatory Memorandum',
			value: explanatoryMemorandumEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		hasEnvironmentalStatement: {
			name: 'Has Environmental Statement',
			value: caseData.notifiedOtherPeople ? 'Yes' : 'No'
		},

		nonTechnicalSummary: {
			name: 'Non-Technical Summary',
			value: nonTechnicalSummaryEvidence.map((evidence) => evidence.Document.fileName)
		},

		hasScreeningDirection: {
			name: 'Has Screening Direction',
			value: screeningEvidence.length > 0 ? 'Yes' : 'No'
		},

		screeningDirectionDocuments: {
			name: 'Screening Direction Documents',
			value: screeningEvidence.map((evidence) => evidence.Document.fileName)
		},

		hasScopingOpinion: {
			name: 'Has Scoping Opinion',
			value: scopingEvidence.length > 0 ? 'Yes' : 'No'
		},

		scopingOpinionDocuments: {
			name: 'Scoping Opinion Documents',
			value: scopingEvidence.map((evidence) => evidence.Document.fileName)
		},

		introductoryChapters: {
			name: 'Introductory Chapters',
			value: introductoryChaptersEvidence.map((evidence) => evidence.Document.fileName)
		},

		aspectChapters: {
			name: 'Aspect Chapters',
			value: aspectChaptersEvidence.map((evidence) => evidence.Document.fileName)
		},

		environmentalStatementAppendices: {
			name: 'Environmental Statement Appendices',
			value: statementAppendicesEvidence.map((evidence) => evidence.Document.fileName)
		},

		environmentalStatementFigures: {
			name: 'Environmental Statement Figures',
			value: statementFiguresEvidence.map((evidence) => evidence.Document.fileName)
		},

		modelInformation: {
			name: 'Model Information',
			value: modelInfoEvidence.map((evidence) => evidence.Document.fileName)
		},

		anyOtherMediaInformation: {
			name: 'Any Other Media Information',
			value: anyOtherMediaInfoEvidence.map((evidence) => evidence.Document.fileName)
		},

		confidentialDocuments: {
			name: 'Confidential Documents',
			value: confidentialEvidence.map((evidence) => evidence.Document.fileName)
		},

		sensitiveInformation: {
			name: 'Sensitive Information',
			value: sensitiveInfoEvidence.map((evidence) => evidence.Document.fileName)
		},

		notifyingOtherPeople: {
			name: 'Notifying Other People',
			value: !!caseData.notifiedOtherPeople
		}
	};
}

function mapFloodRiskInformation(environmentalStatementEvidence: SupportingEvidenceWithDocument[]) {
	const floodRiskAssessmentEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT
	]);

	return {
		hasFloodRiskAssessment: {
			name: 'Has Flood Risk Assessment',
			value: floodRiskAssessmentEvidence.length > 0 ? 'Yes' : 'No'
		},

		floodRiskAssessment: {
			name: 'Flood Risk Assessment',
			value: floodRiskAssessmentEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapHabitatRegulationsAssessmentInformation(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const habitatRegulationsEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
	]);

	return {
		hasHabitatRegulationsAssessmentReport: {
			name: 'Has Habitat Regulations Assessment Report',
			value: habitatRegulationsEvidence.length > 0 ? 'Yes' : 'No'
		},

		habitatRegulationsAssessmentReport: {
			name: 'Habitat Regulations Assessment Report',
			value: habitatRegulationsEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		landPlans: {
			name: 'Land Plans',
			value: landPlansEvidence.map((evidence) => evidence.Document.fileName)
		},

		worksPlans: {
			name: 'Works Plans',
			value: worksPlansEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		compulsoryAcquisition: {
			name: 'Compulsory Acquisition',
			value: statementOfReasonsEvidence.length > 0 ? 'Yes' : 'No'
		},

		statementOfReasons: {
			name: 'Statement of Reasons',
			value: statementOfReasonsEvidence.map((evidence) => evidence.Document.fileName)
		},

		fundingStatement: {
			name: 'Funding Statement',
			value: fundingStatementEvidence.map((evidence) => evidence.Document.fileName)
		},

		bookOfReference: {
			name: 'Book of Reference',
			value: bookOfReferenceEvidence.map((evidence) => evidence.Document.fileName)
		},

		landAndRightsNegotiationsTracker: {
			name: 'Land and Rights Negotiations Tracker',
			value: negotiationsTrackerEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		hasNaturalEnvironmentInformation: {
			name: 'Has Natural Environment Information',
			value: naturalEnvironmentEvidence.length > 0 ? 'Yes' : 'No'
		},

		naturalEnvironmentInformation: {
			name: 'Natural Environment Information',
			value: naturalEnvironmentEvidence.map((evidence) => evidence.Document.fileName)
		},

		hasHistoricEnvironmentInformation: {
			name: 'Has Historic Environment Information',
			value: historicEnvironmentEvidence.length > 0 ? 'Yes' : 'No'
		},

		historicEnvironmentInformation: {
			name: 'Historic Environment Information',
			value: historicEnvironmentEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		hasOtherConsents: {
			name: 'Has Other Consents',
			value: caseData.otherConsentsDescription ? 'Yes' : 'No'
		},

		otherConsentsDescription: {
			name: 'Other Consents Description',
			value: caseData.otherConsentsDescription
		},

		otherConsentsDocuments: {
			name: 'Other Consents Documents',
			value: otherConsentsEvidence.map((evidence) => evidence.Document.fileName)
		}
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
		otherPlansDrawingsSections: {
			name: 'Other Plans/Drawings/Sections',
			value: otherPlansDrawingsSectionsEvidence.map((evidence) => evidence.Document.fileName)
		},

		otherInformation: {
			name: 'Other Information',
			value: otherInformationEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapStatutoryNuisanceInformation(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const statutoryNuisanceEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT
	]);

	return {
		hasStatutoryNuisanceStatement: {
			name: 'Has Statutory Nuisance Statement',
			value: statutoryNuisanceEvidence.length > 0 ? 'Yes' : 'No'
		},

		statutoryNuisanceStatement: {
			name: 'Statutory Nuisance Statement',
			value: statutoryNuisanceEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapDeclaration(caseData: FullCase) {
	return {
		organisation: caseData.submitterOrganisation,
		positionInOrganisation: caseData.submitterPositionInOrganisation,
		name: `${caseData.submitterFirstName} ${caseData.submitterLastName}`,
		date: caseData.anticipatedDateOfSubmission?.toLocaleDateString('en-GB')
	};
}
