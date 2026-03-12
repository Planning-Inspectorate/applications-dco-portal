export const PROJECT_SITE_TYPE_IDS = Object.freeze({
	SINGLE: 'single',
	LINEAR: 'linear'
});

export const PROJECT_SITE_TYPES = [
	{
		id: PROJECT_SITE_TYPE_IDS.SINGLE,
		displayName: 'Single',
		hint: { text: 'A contained area, for example, an offshore wind farm or power station' }
	},
	{
		id: PROJECT_SITE_TYPE_IDS.LINEAR,
		displayName: 'Linear',
		hint: { text: 'An area extending in a line, for example, electric lines, railways or roads' }
	}
];

export const CBOS_PREPOPULATED_HTML_TEMPLATES: Record<string, string> = {
	description: 'views/html-templates/project-description-cbos-populated.html',
	locationDescription: 'views/html-templates/location-or-route-cbos-populated.html'
};
