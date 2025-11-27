import type { PrismaClient } from '@pins/dco-portal-database/src/client';

export const DOCUMENT_CATEGORY_STATUS_ID = Object.freeze({
	NOT_STARTED: 'not-started',
	IN_PROGRESS: 'in-progress',
	COMPLETED: 'completed'
});

export const DOCUMENT_CATEGORY_STATUS = [
	{
		id: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
		displayName: 'Not yet started'
	},
	{
		id: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS,
		displayName: 'In progress'
	},
	{
		id: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
		displayName: 'Completed'
	}
];

export const DOCUMENT_CATEGORY_ID = Object.freeze({
	APPLICATION_FORM_RELATED_INFORMATION: 'application-form-related-information',
	PLANS_AND_DRAWINGS: 'plans-and-drawings',
	DRAFT_DCO: 'draft-dco',
	COMPULSORY_ACQUISITION_INFORMATION: 'compulsory-acquisition-information',
	CONSULTATION_REPORT: 'consultation-report',
	REPORTS_AND_STATEMENTS: 'reports-and-statements',
	ENVIRONMENTAL_STATEMENT: 'environmental-statement',
	ADDITIONAL_PRESCRIBED_INFORMATION: 'additional-prescribed-information',
	OTHER: 'other-documents'
});

export const DOCUMENT_CATEGORY = [
	{
		id: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION,
		displayName: 'Application form related information'
	},
	{
		id: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS,
		displayName: 'Plans and drawings'
	},
	{
		id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
		displayName: 'Draft DCO'
	},
	{
		id: DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION,
		displayName: 'Compulsory acquisition information'
	},
	{
		id: DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT,
		displayName: 'Consultation report'
	},
	{
		id: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS,
		displayName: 'Reports and statements'
	},
	{
		id: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT,
		displayName: 'Environmental statement'
	},
	{
		id: DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION,
		displayName: 'Additional prescribed information'
	},
	{
		id: DOCUMENT_CATEGORY_ID.OTHER,
		displayName: 'Other documents'
	}
];

export const DOCUMENT_SUB_CATEGORY_ID = Object.freeze({
	APPLICATION_COVER_LETTER: 'application-cover-letter',
	GUIDE_TO_THE_APPLICATION: 'guide-to-the-application',
	PRE_APPLICATION_PROGRAMME_DOCUMENT: 'pre-application-programme-document',
	APPLICANTS_SECTION_55_CHECKLIST: 'applicants-section-55-checklist',
	FAST_TRACK_ADMISSION_DOCUMENT: 'fast-track-admission-document',
	LOCATION_PLANS: 'location-plans',
	LAND_PLANS: 'land-plans',
	WORKS_PLAN: 'works-plan',
	ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN: 'access-plan-and-rights-of-way-plan',
	SITE_LAYOUT_PLANS: 'site-layout-plans',
	ELEVATION_DRAWINGS: 'elevation-drawings',
	FLOOR_PLANS: 'floor-plans',
	CAR_PARKING_LANDSCAPING_ACCESS: 'car-parking-landscaping-access',
	DRAINAGE_AND_SURFACE_WATER_MANAGEMENT: 'drainage-and-surface-water-management',
	OTHER_DETAILED_PLANS_AND_SECTIONS: 'other-detailed-plans-and-sections',
	PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES: 'plans-of-statutory-and-non-statutory-sites-or-features',
	PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES: 'plans-showing-historic-or-scheduled-monument-sites',
	CROWN_LAND_PLAN: 'crown-land-plan',
	CHARTS_FOR_MARINE_SCHEMES: 'charts-for-marine-schemes',
	TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN: 'tree-preservation-order-and-hedgerow-plan',
	ENVIRONMENTAL_MANAGEMENT_PLAN: 'environmental-management-plan',
	DRAFT_DEVELOPMENT_CONSENT_ORDER: 'draft-development-consent-order',
	EXPLANATORY_MEMORANDUM: 'explanatory-memorandum',
	SI_VALIDATION_REPORT_SUCCESS_EMAIL: 'si-validation-report-success-email',
	STATEMENT_OF_REASONS: 'statement-of-reasons',
	FUNDING_STATEMENT: 'funding-statement',
	BOOK_OF_REFERENCE_PARTS_1_TO_5: 'book-of-reference-parts-1-to-5',
	LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER: 'land-and-rights-negotiations-tracker',
	CONSULTATION_REPORT: 'consultation-report',
	CONSULTATION_REPORT_APPENDICES: 'consultation-report-appendices',
	HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT: 'habitat-regulations-assessment-screening-report',
	REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT: 'report-to-inform-appropriate-assessment',
	STATUTORY_NUISANCE_STATEMENT: 'statutory-nuisance-statement',
	CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION: 'consents-and-licences-required-under-other-legislation',
	PLANNING_STATEMENT: 'planning-statement',
	DESIGN_AND_ACCESS_STATEMENT: 'design-and-access-statement',
	POLICY_COMPLIANCE_DOCUMENT: 'policy-compliance-document',
	POTENTIAL_MAIN_ISSUES_FOR_THE_EXAMINATION_PMIE: 'potential-main-issues-for-the-examination-pmie',
	DESIGN_APPROACH_DOCUMENT: 'design-approach-document',
	SAFETY_ASSESSMENT: 'safety-assessment',
	NATIONAL_SECURITY_ISSUES: 'national-security-issues',
	DETAILS_OF_ASSOCIATED_DEVELOPMENT: 'details-of-associated-development',
	DRAFT_STATEMENT_OF_COMMON_GROUND: 'draft-statement-of-common-ground',
	INTRODUCTORY_CHAPTERS: 'introductory-chapters',
	ASPECT_CHAPTERS: 'aspect-chapters',
	ENVIRONMENTAL_STATEMENT_APPENDICES: 'environmental-statement-appendices',
	ENVIRONMENTAL_STATEMENT_FIGURES: 'environmental-statement-figures',
	NON_TECHNICAL_SUMMARY: 'non-technical-summary',
	MODEL_INFORMATION: 'model-information',
	ANY_OTHER_MEDIA_INFORMATION: 'any-other-media-information',
	CONFIDENTIAL_DOCUMENTS: 'confidential-documents',
	SCREENING_DIRECTION: 'screening-direction',
	SCOPING_OPINION: 'scoping-opinion',
	FLOOD_RISK_ASSESSMENT: 'flood-risk-assessment',
	SENSITIVE_ENVIRONMENTAL_INFORMATION: 'sensitive-environmental-information',
	OFFSHORE_GENERATING_STATION_DETAILS: 'offshore-generating-station-details',
	NON_OFFSHORE_GENERATING_STATION_STATEMENT: 'non-offshore-generating-station-statement',
	OFFSHORE_CABLE_ROUTE: 'offshore-cable-route',
	OFFSHORE_SAFETY_ZONE_STATEMENT: 'offshore-safety-zone-statement',
	NON_OFFSHORE_CONNECTION_RESPONSIBILITY: 'non-offshore-connection-responsibility',
	HIGHWAY_RAILWAY_LEVELS_DEPTHS_HEIGHTS: 'highway-railway-levels-depths-heights',
	HIGHWAY_RAILWAY_CROSS_SECTIONS: 'highway-railway-cross-sections',
	HIGHWAY_RAILWAY_DRAINAGE_OUTFALLS: 'highway-railway-drainage-outfall-details',
	HARBOUR_FACILITIES_DCO_JUSTIFICATION: 'harbour-facilities-dco-justification',
	PIPELINES_NAME_OWNER: 'pipelines-name-owner',
	PIPELINES_MEASUREMENTS: 'pipelines-measurements',
	PIPELINES_CONTENTS_CONVEYED: 'pipelines-contents-conveyed',
	PIPELINES_GRANT_OF_RIGHTS: 'pipelines-grant-of-rights',
	HAZARDOUS_WASTE_STATEMENT: 'hazardous-waste-statement',
	DAM_RESERVOIR_RECREATIONAL_AMENITIES: 'dam-reservoir-recreational-amenities'
});

export const DOCUMENT_SUB_CATEGORY = [
	{
		id: DOCUMENT_SUB_CATEGORY_ID.APPLICATION_COVER_LETTER,
		displayName: 'Application Cover Letter',
		categoryId: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.GUIDE_TO_THE_APPLICATION,
		displayName: 'Guide to the Application',
		categoryId: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PRE_APPLICATION_PROGRAMME_DOCUMENT,
		displayName: 'Pre-application Programme Document',
		categoryId: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.APPLICANTS_SECTION_55_CHECKLIST,
		displayName: 'Applicant’s section 55 checklist',
		categoryId: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.FAST_TRACK_ADMISSION_DOCUMENT,
		displayName: 'Fast Track Admission Document',
		categoryId: DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.LOCATION_PLANS,
		displayName: 'Location plans',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS,
		displayName: 'Land plans',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN,
		displayName: 'Works plan',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN,
		displayName: 'Access plan and Rights of Way plan',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SITE_LAYOUT_PLANS,
		displayName: 'Site layout plans',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ELEVATION_DRAWINGS,
		displayName: 'Elevation drawings',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.FLOOR_PLANS,
		displayName: 'Floor plans',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS,
		displayName: 'Car parking, landscaping, vehicular and pedestrian access',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DRAINAGE_AND_SURFACE_WATER_MANAGEMENT,
		displayName: 'Drainage and, or surface water management',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.OTHER_DETAILED_PLANS_AND_SECTIONS,
		displayName: 'Other detailed plans and sections',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES,
		displayName:
			'Plans of statutory and non-statutory sites or features (nature conservation, habitats, marine conservation zones, water bodies etc)',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES,
		displayName: 'Plans showing statutory or non-statutory historic or scheduled monument sites',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN,
		displayName: 'Crown land plan',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES,
		displayName: 'Charts for marine schemes',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN,
		displayName: 'Tree Preservation Order and Hedgerow Plan',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_MANAGEMENT_PLAN,
		displayName: 'Environmental Management Plan',
		categoryId: DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER,
		displayName: 'Draft development consent order',
		categoryId: DOCUMENT_CATEGORY_ID.DRAFT_DCO
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM,
		displayName: 'Explanatory memorandum',
		categoryId: DOCUMENT_CATEGORY_ID.DRAFT_DCO
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL,
		displayName: 'SI validation report success email',
		categoryId: DOCUMENT_CATEGORY_ID.DRAFT_DCO
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS,
		displayName: 'Statement of reasons',
		categoryId: DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT,
		displayName: 'Funding statement',
		categoryId: DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5,
		displayName: 'Book of reference (parts 1 to 5)',
		categoryId: DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER,
		displayName: 'Land and Rights Negotiations Tracker',
		categoryId: DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT,
		displayName: 'Consultation report',
		categoryId: DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES,
		displayName: 'Consultation report appendices',
		categoryId: DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT,
		displayName: 'Habitat Regulations Assessment (HRA) Screening Report',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT,
		displayName: 'Report to Inform Appropriate Assessment (where relevant or required)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT,
		displayName: 'Statutory Nuisance Statement',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION,
		displayName: 'Consents and Licences Required Under Other Legislation',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PLANNING_STATEMENT,
		displayName: 'Planning Statement',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DESIGN_AND_ACCESS_STATEMENT,
		displayName: 'Design and Access Statement (DAS)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.POLICY_COMPLIANCE_DOCUMENT,
		displayName: 'Policy Compliance Document',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.POTENTIAL_MAIN_ISSUES_FOR_THE_EXAMINATION_PMIE,
		displayName:
			'Potential Main Issues for the Examination PMIE (supported by Principal Areas of Disagreement Summary Statements (PADSS)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DESIGN_APPROACH_DOCUMENT,
		displayName: 'Design Approach Document (DAD)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SAFETY_ASSESSMENT,
		displayName: 'Safety Assessment (where required)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.NATIONAL_SECURITY_ISSUES,
		displayName: 'National Security Issues (where required)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT,
		displayName: 'Details of associated development, with references to documents',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DRAFT_STATEMENT_OF_COMMON_GROUND,
		displayName: 'Draft Statement of Common Ground (SOCG) (if available at the acceptance stage)',
		categoryId: DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS,
		displayName: 'Introductory chapters',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS,
		displayName: 'Aspect chapters',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES,
		displayName: 'Environmental Statement Appendices',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES,
		displayName: 'Environmental Statement Figures',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
		displayName: 'Non-technical summary',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION,
		displayName: 'Model information',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
		displayName: 'Any other media information',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS,
		displayName: 'Confidential documents (limited use - please discuss with Planning Inspectorate case team)',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
		displayName: 'Screening Direction (if applicable)',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION,
		displayName: 'Scoping Opinion (if applicable)',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT,
		displayName: 'Flood Risk Assessment',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION,
		displayName: 'Sensitive environmental information (please discuss with Planning Inspectorate case team)',
		categoryId: DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION_DETAILS,
		displayName: 'Offshore generating station - details of proposed route for offshore cables, safety zone statement',
		categoryId: DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION_STATEMENT,
		displayName:
			'Non offshore generating station - statement of responsibility for designing and building the connection',
		categoryId: DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_CABLE_ROUTE,
		displayName: 'Offshore generating station - Details of proposed route for offshore cables',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_SAFETY_ZONE_STATEMENT,
		displayName: 'Offshore generating station - Safety zone statement',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_CONNECTION_RESPONSIBILITY,
		displayName:
			'Non offshore generating station - Statement of responsibility for designing and building the connection',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RAILWAY_LEVELS_DEPTHS_HEIGHTS,
		displayName: 'Highway or railway development - Levels, depths, and heights of proposed works',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RAILWAY_CROSS_SECTIONS,
		displayName: 'Highway or railway development - Cross sections',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RAILWAY_DRAINAGE_OUTFALLS,
		displayName: 'Highway or railway development - Drainage outfall details',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES_DCO_JUSTIFICATION,
		displayName: 'Harbour facilities - Statements on why the DCO is necessary',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PIPELINES_NAME_OWNER,
		displayName: 'Pipelines - Name and owner',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PIPELINES_MEASUREMENTS,
		displayName: 'Pipelines - Measurements of pipeline',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PIPELINES_CONTENTS_CONVEYED,
		displayName: 'Pipelines - What will be conveyed by the pipeline',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.PIPELINES_GRANT_OF_RIGHTS,
		displayName: 'Pipelines - Any grant of rights in land or consents that are required',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_STATEMENT,
		displayName: 'Hazardous waste facility - Statement of purpose and annual capacity, final disposal, and recovery',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	},
	{
		id: DOCUMENT_SUB_CATEGORY_ID.DAM_RESERVOIR_RECREATIONAL_AMENITIES,
		displayName: 'Dam or reservoir - Recreational amenities',
		categoryId: DOCUMENT_CATEGORY_ID.OTHER
	}
];

export const APFP_REGULATION = [
	{ id: '5-1', displayName: '5(1)' },
	{ id: '5-2-a', displayName: '5(2)(a)' },
	{ id: '5-2-b', displayName: '5(2)(b)' },
	{ id: '5-2-c', displayName: '5(2)(c)' },
	{ id: '5-2-d', displayName: '5(2)(d)' },
	{ id: '5-2-e', displayName: '5(2)(e)' },
	{ id: '5-2-f', displayName: '5(2)(f)' },
	{ id: '5-2-g', displayName: '5(2)(g)' },
	{ id: '5-2-h', displayName: '5(2)(h)' },
	{ id: '5-2-i', displayName: '5(2)(i)' },
	{ id: '5-2-j', displayName: '5(2)(j)' },
	{ id: '5-2-k', displayName: '5(2)(k)' },
	{ id: '5-2-l', displayName: '5(2)(l)' },
	{ id: '5-2-m', displayName: '5(2)(m)' },
	{ id: '5-2-n', displayName: '5(2)(n)' },
	{ id: '5-2-o', displayName: '5(2)(o)' },
	{ id: '5-2-p', displayName: '5(2)(p)' },
	{ id: '5-2-q', displayName: '5(2)(q)' },
	{ id: '6-1-a-i', displayName: '6(1)(a)(i)' },
	{ id: '6-1-a-ii', displayName: '6(1)(a)(ii)' },
	{ id: '6-1-b-i', displayName: '6(1)(b)(i)' },
	{ id: '6-1-b-ii', displayName: '6(1)(b)(ii)' },
	{ id: '6-2-a', displayName: '6(2)(a)' },
	{ id: '6-2-b', displayName: '6(2)(b)' },
	{ id: '6-3-a', displayName: '6(3)(a)' },
	{ id: '6-4', displayName: '6(4)' },
	{ id: '6-5', displayName: '6(5)' },
	{ id: '6-6', displayName: '6(6)' }
];

export const PAYMENT_METHOD_ID = Object.freeze({
	BACS: 'bacs',
	CHAPS: 'chaps',
	CHEQUE: 'cheque'
});

export const PAYMENT_METHOD = [
	{
		id: PAYMENT_METHOD_ID.BACS,
		displayName: 'BACS'
	},
	{
		id: PAYMENT_METHOD_ID.CHAPS,
		displayName: 'CHAPS'
	},
	{
		id: PAYMENT_METHOD_ID.CHEQUE,
		displayName: 'Cheque'
	}
];

export const WHITELIST_USER_ROLE_ID = Object.freeze({
	SUPER_USER: 'super-user',
	STANDARD_USER: 'standard-user'
});

export const WHITELIST_USER_ROLE = [
	{
		id: WHITELIST_USER_ROLE_ID.SUPER_USER,
		displayName: 'Super User'
	},
	{
		id: WHITELIST_USER_ROLE_ID.STANDARD_USER,
		displayName: 'Standard User'
	}
];

async function upsertReferenceData<TDelegate extends { upsert: (args: any) => any }, TInput extends { id: string }>({
	delegate,
	input
}: {
	delegate: TDelegate;
	input: TInput;
}) {
	return delegate.upsert({
		create: input,
		update: input,
		where: { id: input.id }
	});
}

export async function seedStaticData(dbClient: PrismaClient) {
	await Promise.all(
		DOCUMENT_CATEGORY_STATUS.map((input) => upsertReferenceData({ delegate: dbClient.documentCategoryStatus, input }))
	);

	await Promise.all(
		DOCUMENT_CATEGORY.map((input) => upsertReferenceData({ delegate: dbClient.documentCategory, input }))
	);

	await Promise.all(
		DOCUMENT_SUB_CATEGORY.map((input) => upsertReferenceData({ delegate: dbClient.documentSubCategory, input }))
	);

	await Promise.all(PAYMENT_METHOD.map((input) => upsertReferenceData({ delegate: dbClient.paymentMethod, input })));

	await Promise.all(APFP_REGULATION.map((input) => upsertReferenceData({ delegate: dbClient.apfpRegulation, input })));

	await Promise.all(
		WHITELIST_USER_ROLE.map((input) => upsertReferenceData({ delegate: dbClient.whitelistUserRole, input }))
	);

	await dbClient.$queryRaw`SELECT 1`;
	console.log('static data seed complete');
}
