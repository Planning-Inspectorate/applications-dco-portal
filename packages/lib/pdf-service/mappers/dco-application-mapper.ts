import {
	DOCUMENT_SUB_CATEGORY,
	DOCUMENT_SUB_CATEGORY_ID,
	DOCUMENT_CATEGORY,
	OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS,
	OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS
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

	const prettyEvidenceByCategory = DOCUMENT_CATEGORY.reduce((acc: Record<string, string[]>, curr) => {
		acc[curr.displayName] = evidenceByCategory[curr.id].map((evidence) => evidence.Document.fileName);
		return acc;
	}, {});

	const data = {
		caseReference: caseData.reference,
		application: {
			applicant: {
				name: '1. Applicant',
				data: mapApplicantDetails(caseData)
			},
			agent: {
				name: '2. Agent',
				data: mapAgentDetails(caseData)
			},
			fee: {
				name: '3. Fee',
				data: mapFeeDetails(caseData)
			},
			consentReason: {
				name: '4. Confirming why the Planning Inspectorate should receive the application',
				data: mapConsentReason(caseData)
			},
			projectDescription: {
				name: '5. Non-technical description of the Proposed Development',
				data: mapProjectDescription(caseData)
			},
			locationOrRoute: {
				name: '6. Location or route of the Proposed Development',
				data: mapLocationOrRoute(caseData, evidenceByCategory['plans-and-drawings'])
			},
			associatedDevelopments: {
				name: '7. Associated Development',
				data: mapAssociatedDevelopments(evidenceByCategory['reports-and-statements'])
			},

			consultationReport: {
				name: '8. a) Consultation Report',
				data: mapConsultationReport(evidenceByCategory['consultation-report'])
			},

			consultationReportAppendices: {
				name: '8. b) Copies of newspaper notices',
				data: mapConsultationReportAppendices(evidenceByCategory['consultation-report'])
			},

			draftOrderAndExplanatoryMemorandum: {
				name: '9. Draft Development Consent Order',
				data: mapDraftDcoOrder(evidenceByCategory['draft-dco'])
			},

			explanatoryMemorandum: {
				name: '10. Explanatory Memorandum',
				data: mapExplanatoryMemorandum(evidenceByCategory['draft-dco'])
			},

			landPlan: {
				name: '11. Land Plan',
				data: mapLandPlan(evidenceByCategory['plans-and-drawings'])
			},

			worksPlan: {
				name: '12. Works Plans',
				data: mapWorksPlan(evidenceByCategory['plans-and-drawings'])
			},

			landRightsInformation: {
				name: '13. Compulsory Acquisition of land or an interest in land or right over land',
				data: mapLandRightsInformation(evidenceByCategory['compulsory-acquisition-information'])
			},

			environmentalImpactAssessment: {
				name: '14. a) Environmental Impact Assessment (EIA)',
				data: mapEnvironmentalImpactAssessment(caseData, evidenceByCategory['environmental-statement'])
			},

			screeningAndScoping: {
				name: '14. b) Screening Opinion/ Direction and Scoping Opinion/ Direction',
				data: mapScreeningAndScopingDirection(evidenceByCategory['environmental-statement'])
			},

			environmentalStatementNotifications: {
				name: '14. c) Publicity required under Regulation 13 of The Infrastructure Planning (Environmental Impact Assessment) Regulations 2017 (or where the transitional provisions apply, Regulation 11 of The Infrastructure Planning (Environmental Impact Assessment) Regulations 2009)',
				data: mapEnvironmentalStatementNotifications(caseData)
			},

			habitatRegulationsAssessmentInformation: {
				name: '15. European sites (to which Regulation 63 of The Conservation of Habitats and Species Regulations 2017 and/ or Regulation 28 of the Conservation of Offshore Marine Habitats and Species Regulations 2017 applies) or a Ramsar site.',
				data: mapHabitatRegulationsAssessmentInformation(evidenceByCategory['reports-and-statements'])
			},

			naturalEnvironmentInformation: {
				name: '16. A plan, with accompanying information, identifying any statutory or non statutory sites or features of nature conservation, geological or landscape importance; habitats of protected species, important habitats or other diversity features; and water bodies in a River Basin Management Plan - together with an assessment of any effects likely to be caused by the Proposed Development.',
				data: mapNaturalEnvironmentInformation(evidenceByCategory['plans-and-drawings'])
			},
			historicEnvironmentInformation: {
				name: '17. A plan, with accompanying information, identifying any statutory or non statutory sites or features of the historic environment such as scheduled monuments, World Heritage sites, listed buildings and other historic structures, archaeological sites and registered battlefields, together with an assessment of any effects likely to be caused by the Proposed Development',
				data: mapHistoricEnvironmentInformation(evidenceByCategory['plans-and-drawings'])
			},

			floodRiskInformation: {
				name: '18. Flood Risk Assessment',
				data: mapFloodRiskInformation(evidenceByCategory['environmental-statement'])
			},

			statutoryNuisanceInformation: {
				name: '19. Matters set out in section 79(1) (statutory nuisances etc) of the Environmental Protection Act 1990',
				data: mapStatutoryNuisanceInformation(evidenceByCategory['reports-and-statements'])
			},

			crownLandAccess: {
				name: '20. A plan with any accompanying information identifying any Crown land',
				data: mapCrownLandAccess(evidenceByCategory['plans-and-drawings'])
			},

			rightOfWayPlans: {
				name: '21. A plan identifying new or altered means of access, stopping up of streets or any diversions, extinguishments or creation or rights of way or public rights of navigation',
				data: mapRightOfWayPlans(evidenceByCategory['plans-and-drawings'])
			},

			infrastructureSpecificAdditionalInformation: {
				name: '22. Additional information for specific types of infrastructure',
				data: mapInfrastructureSpecificAdditionalInformation(
					caseData,
					evidenceByCategory['additional-prescribed-information']
				)
			},

			otherPlansAndReports: {
				name: '23. Any other plans, drawings and sections necessary to describe the proposal for which development consent is sought, and any other documents, reports or information to support the application',
				data: mapOtherPlansAndReports(otherPlansAndReportsCategories)
			},

			otherConsentsOrLicenses: {
				name: '24. Other consents/ licences required under other legislation',
				data: mapOtherConsentsOrLicenses(caseData, evidenceByCategory['reports-and-statements'])
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

function mapApplicantDetails(caseData: FullCase) {
	return {
		applicantOrganisation: { name: 'Organisation', value: [caseData.ApplicantDetails?.organisation] },
		applicantName: {
			name: 'Name',
			value: [`${caseData.ApplicantDetails?.firstName || ''} ${caseData.ApplicantDetails?.lastName || ''}`]
		},
		applicantEmail: { name: 'Email address', value: [caseData.ApplicantDetails?.emailAddress] },
		applicantPhone: { name: 'Phone number', value: [caseData.ApplicantDetails?.phone] },
		applicantAddress: {
			name: 'Address',
			value: [
				caseData.ApplicantDetails?.Address?.addressLine1,
				caseData.ApplicantDetails?.Address?.addressLine2,
				caseData.ApplicantDetails?.Address?.townCity,
				caseData.ApplicantDetails?.Address?.county,
				caseData.ApplicantDetails?.Address?.country,
				caseData.ApplicantDetails?.Address?.postcode
			]
		}
	};
}

function mapAgentDetails(caseData: FullCase) {
	return {
		isAgent: { name: 'Are you an agent?', value: [caseData.AgentDetails ? 'Yes' : 'No'] },
		agentOrganisation: { name: 'Organisation', value: [caseData.AgentDetails?.organisation] },
		agentName: {
			name: 'Name',
			value: [`${caseData.AgentDetails?.firstName || ''} ${caseData.AgentDetails?.lastName || ''}`]
		},
		agentEmail: { name: 'Email address', value: [caseData.AgentDetails?.emailAddress] },
		agentPhone: { name: 'Phone number', value: [caseData.AgentDetails?.phone] },
		agentAddress: {
			name: 'Address',
			value: [
				caseData.AgentDetails?.Address?.addressLine1,
				caseData.AgentDetails?.Address?.addressLine2,
				caseData.AgentDetails?.Address?.townCity,
				caseData.AgentDetails?.Address?.county,
				caseData.AgentDetails?.Address?.country,
				caseData.AgentDetails?.Address?.postcode
			]
		}
	};
}

function mapFeeDetails(caseData: FullCase) {
	return {
		paymentMethod: { name: 'Payment method', value: [caseData.CasePaymentMethod?.displayName] },
		paymentReference: { name: 'Payment reference', value: [caseData.paymentReference] }
	};
}

function mapConsentReason(caseData: FullCase) {
	return {
		projectConsentReason: { name: 'Why the project needs development consent', value: [caseData.projectConsentReason] }
	};
}

function mapProjectDescription(caseData: FullCase) {
	return {
		projectDescription: { name: 'Project description', value: [caseData.projectDescription] }
	};
}

function mapLocationOrRoute(caseData: FullCase, plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const locationOrRouteDocuments = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.LOCATION_PLANS
	]);

	return {
		locationDescription: { name: 'Project location or route description', value: [caseData.locationDescription] },
		singleOrLinear: {
			name: 'Single or linear site',
			value: [caseData.ProjectSingleSite ? 'Single' : 'Linear']
		},

		singleGridReferences: {
			name: 'Single site grid references',
			value: [caseData.ProjectSingleSite?.easting, caseData.ProjectSingleSite?.northing]
		},
		startLinearGridReferences: {
			name: 'Start linear grid references',
			value: [caseData.ProjectLinearSite?.startEasting, caseData.ProjectLinearSite?.startNorthing]
		},
		middleLinearGridReferences: {
			name: 'Middle linear grid references',
			value: [caseData.ProjectLinearSite?.middleEasting, caseData.ProjectLinearSite?.middleNorthing]
		},
		endLinearGridReferences: {
			name: 'End linear grid references',
			value: [caseData.ProjectLinearSite?.endEasting, caseData.ProjectLinearSite?.endNorthing]
		},
		locationOrRouteDocuments: {
			name: 'Location or route documents',
			value: locationOrRouteDocuments.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapAssociatedDevelopments(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const associatedDevelopments = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT
	]);

	return {
		hasAssociatedDevelopments: {
			name: 'Does the project include an associated development?',
			value: [associatedDevelopments.length > 0 ? 'Yes' : 'No']
		},

		associatedDevelopments: {
			name: 'Associated development documents',
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
			name: 'Is any additional information required for this type of infrastructure?',
			value: [caseData.infrastructureAdditionalInformationDescription ? 'Yes' : 'No']
		},

		additionalInformationDescription: {
			name: 'Additional information description',
			value: [caseData.infrastructureAdditionalInformationDescription]
		},

		nonOffshoreGeneratingStation: {
			name: 'Construction or extension of a non offshore generating station (Reg. 6 (1a))',
			nested: true,
			value: {
				electricityGrid: {
					name: 'Who will design and build the connection to the electricity grid for the non offshore generating station?',
					value: [caseData.NonOffshoreGeneratingStation?.electricityGrid]
				},
				gasFuelledGeneratingStation: {
					name: 'Is it a gas fuelled non offshore generating station?',
					value: [caseData.NonOffshoreGeneratingStation?.gasFuelledGeneratingStation ? 'Yes' : 'No']
				},
				gasPipelineConnection: {
					name: 'Who will design and build the gas pipeline connection to the non offshore generating station?',
					value: [caseData.NonOffshoreGeneratingStation?.gasPipelineConnection]
				},
				supportingEvidence: {
					name: 'Non offshore generating station additional documents',
					value: nonOffshoreEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		offshoreGeneratingStation: {
			name: 'Construction or extension of an offshore generating station (Reg. 6 (1b))',
			nested: true,
			value: {
				cableInstallation: {
					name: 'Route and method of installation for any cable in the offshore generating station',
					value: [caseData.OffshoreGeneratingStation?.cableInstallation]
				},
				safetyZones: {
					name: 'Will you apply for safety zones for the offshore generating station?',
					value: [caseData.OffshoreGeneratingStation?.safetyZones]
				},
				supportingEvidence: {
					name: 'Offshore generating station additional documents',
					value: offshoreEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		highwayRelatedDevelopment: {
			name: 'Highway related development (Reg. 6 (2) (part 1))',
			nested: true,
			value: {
				groundLevels: {
					name: 'Ground levels of the highway related development',
					value: [caseData.HighwayRelatedDevelopment?.groundLevels]
				},
				bridgeHeights: {
					name: 'Height of every bridge, viaduct, aqueduct, embankment and elevated guide way for the highway related development',
					value: [caseData.HighwayRelatedDevelopment?.bridgeHeights]
				},
				tunnelDepths: {
					name: 'Depth of every cutting and tunnel for the highway related development',
					value: [caseData.HighwayRelatedDevelopment?.tunnelDepths]
				},
				tidalWaterLevels: {
					name: 'Levels of the bed of relevant tidal waters or inland waterways for the highway related development',
					value: [caseData.HighwayRelatedDevelopment?.tidalWaterLevels]
				},
				heightOfStructures: {
					name: 'Height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways for the highway related development',
					value: [caseData.HighwayRelatedDevelopment?.heightOfStructures]
				},
				drainageOutfallDetails: {
					name: 'Drainage outfall details for highways',
					value: [caseData.HighwayRelatedDevelopment?.drainageOutfallDetails]
				},
				supportingEvidence: {
					name: 'Highway related development additional documents',
					value: highwayEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		railwayDevelopment: {
			name: 'Construction or alteration of a railway (Reg. 6 (2) (part 2))',
			nested: true,
			value: {
				groundLevels: {
					name: 'Ground levels of the railway development',
					value: [caseData.RailwayDevelopment?.groundLevels]
				},
				bridgeHeights: {
					name: 'Height of every bridge, viaduct, aqueduct, embankment and elevated guide way for the railway development',
					value: [caseData.RailwayDevelopment?.bridgeHeights]
				},
				tunnelDepths: {
					name: 'Depth of every cutting and tunnel for the railway development',
					value: [caseData.RailwayDevelopment?.tunnelDepths]
				},
				tidalWaterLevels: {
					name: 'Levels of the bed of relevant tidal waters or inland waterways for the railway development',
					value: [caseData.RailwayDevelopment?.tidalWaterLevels]
				},
				heightOfStructures: {
					name: 'Height of every structure or device intended to be erected above, on or below the bed of tidal waters or inland waterways for the railway development',
					value: [caseData.RailwayDevelopment?.heightOfStructures]
				},
				drainageOutfallDetails: {
					name: 'Drainage outfall details for railways',
					value: [caseData.RailwayDevelopment?.drainageOutfallDetails]
				},
				supportingEvidence: {
					name: 'Railway development additional documents',
					value: railwayEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		harbourFacilities: {
			name: 'Construction or alteration of harbour facilities (Reg. 6 (3))',
			nested: true,
			value: {
				whyHarbourOrderNeeded: {
					name: 'Why is the order needed to improve, maintain or manage the harbour?',
					value: [caseData.HarbourFacilities?.whyHarbourOrderNeeded]
				},
				benefitsToSeaTransport: {
					name: 'How will the order for a harbour facility benefit transport by sea or recreational use of sea-going ships?',
					value: [caseData.HarbourFacilities?.benefitsToSeaTransport]
				},
				supportingEvidence: {
					name: 'Harbour facility additional documents',
					value: harbourEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		pipelines: {
			name: 'Construction of a pipeline (Reg. 6 (4))',
			nested: true,
			value: {
				name: { name: 'Pipeline name', value: [caseData.Pipelines?.name] },
				owner: { name: 'Pipeline owner', value: [caseData.Pipelines?.owner] },
				startPoint: { name: 'Pipeline start point', value: [caseData.Pipelines?.startPoint] },
				endPoint: { name: 'Pipeline end point', value: [caseData.Pipelines?.endPoint] },
				length: { name: 'Pipeline length', value: [caseData.Pipelines?.length] },
				externalDiameter: { name: 'Pipeline external diameter', value: [caseData.Pipelines?.externalDiameter] },
				conveyance: { name: 'What will the pipeline convey?', value: [caseData.Pipelines?.conveyance] },
				landRightsCrossingConsents: {
					name: 'Does the pipeline need rights in land or crossing consents?',
					value: [caseData.Pipelines?.landRightsCrossingConsents ? 'Yes' : 'No']
				},
				landRightsCrossingConsentsAgreement: {
					name: 'Can parties obtain rights in land or crossing consents by agreement for the pipeline?',
					value: [caseData.Pipelines?.landRightsCrossingConsentsAgreement]
				},
				supportingEvidence: {
					name: 'Pipeline additional documents',
					value: pipelinesEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		hazardousWasteFacility: {
			name: 'Construction or alteration of a hazardous waste facility (Reg. 6 (5))',
			nested: true,
			value: {
				whyIsFacilityNeeded: {
					name: 'Why is the hazardous waste facility needed?',
					value: [caseData.HazardousWasteFacility?.whyIsFacilityNeeded]
				},
				annualCapacity: {
					name: 'What is the plant’s estimated annual capacity for disposing or recovering hazardous waste?',
					value: [caseData.HazardousWasteFacility?.annualCapacity]
				},
				supportingEvidence: {
					name: 'Hazardous waste facility additional documents',
					value: hazardousWasteEvidence.map((e) => e.Document.fileName)
				}
			}
		},

		damOrReservoir: {
			name: 'Construction of a dam or reservoir (Reg. 6 (6))',
			nested: true,
			value: {
				recreationalAmenities: {
					name: 'Will the dam or reservoir include any recreational amenities?',
					value: [caseData.DamOrReservoir?.recreationalAmenities ? 'Yes' : 'No']
				},
				recreationalAmenitiesDescription: {
					name: 'Description of the dam or reservoir’s recreational amenities',
					value: [caseData.DamOrReservoir?.recreationalAmenitiesDescription]
				},
				supportingEvidence: {
					name: 'Dam or reservoir additional documents',
					value: damsAndReservoirsEvidence.map((e) => e.Document.fileName)
				}
			}
		}
	};
}

function mapConsultationReport(consultationEvidence: SupportingEvidenceWithDocument[]) {
	const consultationReportEvidence = findSupportingEvidenceBySubcategory(consultationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
	]);

	return {
		consultationReport: {
			name: 'Consultation report documents',
			value: consultationReportEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapConsultationReportAppendices(consultationEvidence: SupportingEvidenceWithDocument[]) {
	const consultationAppendicesEvidence = findSupportingEvidenceBySubcategory(consultationEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
	]);

	return {
		consultationReportAppendices: {
			name: 'Newspaper notices documents',
			value: consultationAppendicesEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapCrownLandAccess(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const crownLandEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN
	]);

	return {
		hasCrownLand: {
			name: 'Could the project affect any Crown land?',
			value: [crownLandEvidence.length > 0 ? 'Yes' : 'No']
		},

		crownLandPlans: {
			name: 'Crown land documents',
			value: crownLandEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapRightOfWayPlans(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const accessPlanEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
	]);

	return {
		hasMeansOfAccess: {
			name: 'Could the project require changes to access or public rights of way?',
			value: [accessPlanEvidence.length > 0 ? 'Yes' : 'No']
		},

		accessAndRightsOfWayPlans: {
			name: 'Changes to access or public rights of way documents',
			value: accessPlanEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapDraftDcoOrder(draftDcoEvidence: SupportingEvidenceWithDocument[]) {
	const draftDcoOrderEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
	]);
	const siValidationEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
	]);

	return {
		draftDevelopmentConsentOrder: {
			name: 'Draft development consent order (DCO) documents',
			value: draftDcoOrderEvidence.map((evidence) => evidence.Document.fileName)
		},

		siValidationReportSuccessEmail: {
			name: 'Statutory instrument (SI) validation report success email documents',
			value: siValidationEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapExplanatoryMemorandum(draftDcoEvidence: SupportingEvidenceWithDocument[]) {
	const explanatoryMemorandumEvidence = findSupportingEvidenceBySubcategory(draftDcoEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM
	]);

	return {
		explanatoryMemorandum: {
			name: 'Explanatory memorandum documents',
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
			name: 'Does the project require an environmental statement?',
			value: [nonTechnicalSummaryEvidence.length ? 'Yes' : 'No']
		},

		nonTechnicalSummary: {
			name: 'Non-technical summary',
			value: nonTechnicalSummaryEvidence.map((evidence) => evidence.Document.fileName)
		},

		introductoryChapters: {
			name: 'Introductory chapters',
			value: introductoryChaptersEvidence.map((evidence) => evidence.Document.fileName)
		},

		aspectChapters: {
			name: 'Aspect chapters',
			value: aspectChaptersEvidence.map((evidence) => evidence.Document.fileName)
		},

		environmentalStatementAppendices: {
			name: 'Appendices',
			value: statementAppendicesEvidence.map((evidence) => evidence.Document.fileName)
		},

		environmentalStatementFigures: {
			name: 'Figures',
			value: statementFiguresEvidence.map((evidence) => evidence.Document.fileName)
		},

		modelInformation: {
			name: 'Model information',
			value: modelInfoEvidence.map((evidence) => evidence.Document.fileName)
		},

		anyOtherMediaInformation: {
			name: 'Media information',
			value: anyOtherMediaInfoEvidence.map((evidence) => evidence.Document.fileName)
		},

		confidentialDocuments: {
			name: 'Confidential documents',
			value: confidentialEvidence.map((evidence) => evidence.Document.fileName)
		},

		sensitiveInformation: {
			name: 'Sensitive information',
			value: sensitiveInfoEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapScreeningAndScopingDirection(environmentalStatementEvidence: SupportingEvidenceWithDocument[]) {
	const screeningEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION
	]);
	const scopingEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION
	]);

	return {
		hasScreeningDirection: {
			name: 'Have you sought or received a screening opinion or direction?',
			value: [screeningEvidence.length > 0 ? 'Yes' : 'No']
		},

		screeningDirectionDocuments: {
			name: 'Screening opinion or direction documents',
			value: screeningEvidence.map((evidence) => evidence.Document.fileName)
		},

		hasScopingOpinion: {
			name: 'Have you sought or received a scoping opinion or direction?',
			value: [scopingEvidence.length > 0 ? 'Yes' : 'No']
		},

		scopingOpinionDocuments: {
			name: 'Scoping opinion or direction documents',
			value: scopingEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapEnvironmentalStatementNotifications(caseData: FullCase) {
	return {
		notifyingConsultationBodies: {
			name: 'Have you notified the consultation bodies about the project?',
			value: [caseData.notifyingConsultationBodies ? 'Yes' : 'No']
		},

		whyNotNotifyingConsultationBodies: {
			name: 'Explanation for not notifying the consultation bodies',
			value: [caseData.whyNotNotifyingConsultationBodies]
		},

		notifiedOtherPeople: {
			name: 'Have you notified any other people under Regulation 11(1)(c) about the project?',
			value: [caseData.notifiedOtherPeople ? 'Yes' : 'No']
		}
	};
}

function mapFloodRiskInformation(environmentalStatementEvidence: SupportingEvidenceWithDocument[]) {
	const floodRiskAssessmentEvidence = findSupportingEvidenceBySubcategory(environmentalStatementEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT
	]);

	return {
		hasFloodRiskAssessment: {
			name: 'Does the project require a flood risk assessment?',
			value: [floodRiskAssessmentEvidence.length > 0 ? 'Yes' : 'No']
		},

		floodRiskAssessment: {
			name: 'Flood risk assessment',
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
			name: 'Does the project require a Habitat Regulations Assessment (HRA) report?',
			value: [habitatRegulationsEvidence.length > 0 ? 'Yes' : 'No']
		},

		habitatRegulationsAssessmentReport: {
			name: 'Habitat Regulations Assessment (HRA) documents',
			value: habitatRegulationsEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapLandPlan(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const landPlansEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS
	]);

	return {
		landPlans: {
			name: 'Land plan documents',
			value: landPlansEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapWorksPlan(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const worksPlansEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN
	]);

	return {
		worksPlans: {
			name: 'Works plan documents',
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
			name: 'Does the project include any compulsory acquisition of land, an interest in land, or rights over land?',
			value: [statementOfReasonsEvidence.length > 0 ? 'Yes' : 'No']
		},

		statementOfReasons: {
			name: 'Statement of reasons',
			value: statementOfReasonsEvidence.map((evidence) => evidence.Document.fileName)
		},

		fundingStatement: {
			name: 'Funding statement',
			value: fundingStatementEvidence.map((evidence) => evidence.Document.fileName)
		},

		bookOfReference: {
			name: 'Book of Reference (BoR)',
			value: bookOfReferenceEvidence.map((evidence) => evidence.Document.fileName)
		},

		landAndRightsNegotiationsTracker: {
			name: 'Land and rights negotiations tracker documents',
			value: negotiationsTrackerEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapNaturalEnvironmentInformation(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const naturalEnvironmentEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
	]);

	return {
		hasNaturalEnvironmentInformation: {
			name: 'Could the project affect any nature conservation, landscape, geological or water features?',
			value: [naturalEnvironmentEvidence.length > 0 ? 'Yes' : 'No']
		},

		naturalEnvironmentInformation: {
			name: 'Nature conservation, landscape, geological or water features documents',
			value: naturalEnvironmentEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapHistoricEnvironmentInformation(plansAndDrawingsEvidence: SupportingEvidenceWithDocument[]) {
	const historicEnvironmentEvidence = findSupportingEvidenceBySubcategory(plansAndDrawingsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES
	]);

	return {
		hasHistoricEnvironmentInformation: {
			name: 'Could the project affect any historic environment sites or features?',
			value: [historicEnvironmentEvidence.length > 0 ? 'Yes' : 'No']
		},

		historicEnvironmentInformation: {
			name: 'Historic environment sites or features documents',
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
			name: 'Does the project require other consents or licences?',
			value: [caseData.otherConsentsDescription ? 'Yes' : 'No']
		},

		otherConsentsDescription: {
			name: 'Description of other consents or licences required',
			value: [caseData.otherConsentsDescription]
		},

		otherConsentsDocuments: {
			name: 'Other consents or licences documents',
			value: otherConsentsEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapOtherPlansAndReports(otherPlansAndReportsEvidence: SupportingEvidenceWithDocument[]) {
	const otherPlansDrawingsSectionsEvidence = findSupportingEvidenceBySubcategory(
		otherPlansAndReportsEvidence,
		OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS[OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS.OTHER_PLANS_DRAWINGS_SECTIONS]
	);
	const supportingInformationEvidence = findSupportingEvidenceBySubcategory(
		otherPlansAndReportsEvidence,
		OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS[OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS.SUPPORTING_INFORMATION]
	);

	return {
		otherPlansDrawingsSections: {
			name: 'Other plans, drawing or sections documents',
			value: otherPlansDrawingsSectionsEvidence.map((evidence) => evidence.Document.fileName)
		},

		supportingInformation: {
			name: 'Other supporting information documents',
			value: supportingInformationEvidence.map((evidence) => evidence.Document.fileName)
		}
	};
}

function mapStatutoryNuisanceInformation(reportsAndStatementsEvidence: SupportingEvidenceWithDocument[]) {
	const statutoryNuisanceEvidence = findSupportingEvidenceBySubcategory(reportsAndStatementsEvidence, [
		DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT
	]);

	return {
		hasStatutoryNuisanceStatement: {
			name: 'Could the project cause any statutory nuisances?',
			value: [statutoryNuisanceEvidence.length > 0 ? 'Yes' : 'No']
		},

		statutoryNuisanceStatement: {
			name: 'Statutory nuisance statement',
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
