/**
 * @typedef {object} ApplicationSection
 * @property {string} name      - Human-readable section name used in the test title.
 * @property {string} fragment  - Route fragment for the section (matches the URL path).
 * @property {string} heading   - Expected h1/h2 heading text shown on the check-your-answers page.
 */

/**
 * "Your application" sections from the home-page task list, in the order they appear.
 *
 * These sections use the dynamic-forms journey with a `/check-your-answers` summary page,
 * as opposed to the file-upload sections which have their own document-management page.
 *
 * @type {ApplicationSection[]}
 */
export const APPLICATION_SECTIONS = [
	{
		name: 'Applicant and agent details',
		fragment: '/applicant-and-agent-details',
		heading: 'Applicant and agent details'
	},
	{
		name: 'About the project',
		fragment: '/about-the-project',
		heading: 'About the Project'
	},
	{
		name: 'Publicity details',
		fragment: '/publicity-details',
		heading: 'Publicity details'
	},
	{
		name: 'Draft order and explanatory memorandum',
		fragment: '/draft-order-and-explanatory-memorandum',
		heading: 'Draft order and explanatory memorandum'
	},
	{
		name: 'Land and works plans',
		fragment: '/land-and-works-plans',
		heading: 'Land and works plans'
	},
	{
		name: 'Land rights information',
		fragment: '/land-rights-information',
		heading: 'Land rights information'
	},
	{
		name: 'Environmental impact assessment information',
		fragment: '/environmental-impact-assessment-information',
		heading: 'Environmental impact assessment information'
	},
	{
		name: 'Habitat regulations assessment information',
		fragment: '/habitat-regulations-assessment-information',
		heading: 'Habitat regulations assessment information'
	},
	{
		name: 'Nature conservation and environmental information',
		fragment: '/nature-conservation-and-environmental-information',
		heading: 'Nature conservation and environmental information'
	},
	{
		name: 'Flood risk information',
		fragment: '/flood-risk-information',
		heading: 'Flood risk information'
	},
	{
		name: 'Statutory nuisance information',
		fragment: '/statutory-nuisance-information',
		heading: 'Statutory nuisance information'
	},
	{
		name: 'Crown land, access, and rights of way plans',
		fragment: '/crown-land-access-and-rights-of-way-plans',
		heading: 'Crown land, access, and rights of way plans'
	},
	{
		name: 'Infrastructure-specific additional information',
		fragment: '/infrastructure-specific-additional-information',
		heading: 'Infrastructure-specific additional information'
	},
	{
		name: 'Other plans and reports (optional)',
		fragment: '/other-plans-and-reports',
		heading: 'Other plans and reports'
	},
	{
		name: 'Other consents or licences details',
		fragment: '/other-consents-or-licences-details',
		heading: 'Other consents or licences details'
	}
];
