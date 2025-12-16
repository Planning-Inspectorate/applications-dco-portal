/*
    constants.ts stores any constants for use in our dynamic forms that don't live in the database/aren't depended on for database seeding
*/

export const APPLICATION_SECTION_ID = Object.freeze({
	APPLICANT_AND_AGENT_DETAILS: 'applicant-and-agent-details',
	ABOUT_THE_PROJECT: 'about-the-project',
	CONSULTATION_AND_PUBLICITY_DETAILS: 'consultation-and-publicity-details',
	DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM: 'draft-order-and-explanatory-memorandum',
	LAND_AND_WORKS_PLANS: 'land-and-works-plans',
	LAND_RIGHTS_INFORMATION: 'land-rights-information',
	ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION: 'environmental-impact-assessment-information',
	HABITAT_REGULATIONS_ASSESSMENT_INFORMATION: 'habitat-regulations-assessment-information',
	NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION: 'nature-conservation-and-environmental-information',
	FLOOD_RISK_INFORMATION: 'flood-risk-information',
	STATUTORY_NUISANCE_INFORMATION: 'statutory-nuisance-information',
	CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS: 'crown-land-access-and-rights-of-way-plans',
	INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION: 'infrastructure-specific-additional-information',
	OTHER_PLANS_AND_REPORTS: 'other-plans-and-reports',
	OTHER_CONSENTS_OR_LICENCES_DETAILS: 'other-consents-or-licences-details'
});

export const APPLICATION_SECTION = [
	{
		id: APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS,
		displayName: 'Applicant and agent details'
	},
	{
		id: APPLICATION_SECTION_ID.ABOUT_THE_PROJECT,
		displayName: 'About the project'
	},
	{
		id: APPLICATION_SECTION_ID.CONSULTATION_AND_PUBLICITY_DETAILS,
		displayName: 'Consultation and publicity details'
	},
	{
		id: APPLICATION_SECTION_ID.DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM,
		displayName: 'Draft order and explanatory memorandum'
	},
	{
		id: APPLICATION_SECTION_ID.LAND_AND_WORKS_PLANS,
		displayName: 'Land and works plans'
	},
	{
		id: APPLICATION_SECTION_ID.LAND_RIGHTS_INFORMATION,
		displayName: 'Land rights information'
	},
	{
		id: APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION,
		displayName: 'Environmental impact assessment information'
	},
	{
		id: APPLICATION_SECTION_ID.HABITAT_REGULATIONS_ASSESSMENT_INFORMATION,
		displayName: 'Habitat regulations assessment information'
	},
	{
		id: APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION,
		displayName: 'Nature conservation and environmental information'
	},
	{
		id: APPLICATION_SECTION_ID.FLOOD_RISK_INFORMATION,
		displayName: 'Flood risk information'
	},
	{
		id: APPLICATION_SECTION_ID.STATUTORY_NUISANCE_INFORMATION,
		displayName: 'Statutory nuisance information'
	},
	{
		id: APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS,
		displayName: 'Crown land, access, and rights of way plans'
	},
	{
		id: APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION,
		displayName: 'Infrastructure-specific additional information'
	},
	{
		id: APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS,
		displayName: 'Other plans and reports'
	},
	{
		id: APPLICATION_SECTION_ID.OTHER_CONSENTS_OR_LICENCES_DETAILS,
		displayName: 'Other consents or licences details'
	}
];
