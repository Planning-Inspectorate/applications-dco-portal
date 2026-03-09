// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';

export function getQuestions() {
	const questions = {
		otherPlansDrawingsSections: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Other Plans, Drawings or Sections',
			question: 'Which documents contain other plans, drawings or sections? (optional)',
			hint: 'Select all that apply',
			fieldName: 'otherPlansDrawingsSections',
			url: 'plans-drawings-sections',
			validators: []
		},
		supportingInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Supporting Information',
			question: 'Which documents contain any other supporting information? (optional)',
			fieldName: 'supportingInformation',
			url: 'supporting-information',
			validators: []
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
