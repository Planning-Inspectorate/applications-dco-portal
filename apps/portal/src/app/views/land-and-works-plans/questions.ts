import { createQuestions, questionClasses, RequiredValidator } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		landPlans: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Land plan documents',
			question: 'Which documents make up the land plan?',
			hint: 'Select all that apply',
			fieldName: 'landPlans',
			url: DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS,
			validators: [new RequiredValidator('Select the documents relating to the land plan')]
		},
		worksPlans: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Works plan documents',
			question: 'Which documents make up the works plan?',
			hint: 'Select all that apply',
			fieldName: 'worksPlans',
			url: DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN,
			validators: [new RequiredValidator('Select the documents relating to the works plan')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
