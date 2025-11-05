/*
    constants.ts stores any constants for use in our dynamic forms that don't live in the database/aren't depended on for database seeding
*/

export const APPLICATION_SECTION_ID = Object.freeze({
	APPLICANT_AND_AGENT_DETAILS: 'applicant-and-agent-details',
	ABOUT_THE_PROJECT: 'about-the-project'
});

export const APPLICATION_SECTION = [
	{
		id: APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS,
		displayName: 'Applicant and agent details'
	},
	{
		id: APPLICATION_SECTION_ID.ABOUT_THE_PROJECT,
		displayName: 'About the project'
	}
];
