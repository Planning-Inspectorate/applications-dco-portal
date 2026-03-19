// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		otherPlansDrawingsSections: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Other plans, drawings or sections documents',
			question: 'Which documents contain other plans, drawings or sections? (optional)',
			hint: 'Select all that apply',
			fieldName: 'otherPlansDrawingsSections',
			url: OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS.OTHER_PLANS_DRAWINGS_SECTIONS,
			validators: []
		},
		supportingInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Other supporting information documents',
			question: 'Which documents contain any other supporting information? (optional)',
			fieldName: 'supportingInformation',
			url: OTHER_PLANS_AND_REPORTS_SUBCATEGORY_IDS.SUPPORTING_INFORMATION,
			validators: []
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
