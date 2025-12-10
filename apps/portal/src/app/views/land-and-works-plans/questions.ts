// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';

export function getQuestions() {
	const questions = {
		landPlans: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Land Plans',
			pageTitle: 'Land Plans',
			question: 'Which documents relate to the land plans?',
			fieldName: 'landPlans',
			url: 'land-plans',
			validators: [new RequiredValidator()]
		},
		worksPlans: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Works Plans',
			pageTitle: 'Works Plans',
			question: 'Which documents relate to the works plan?',
			fieldName: 'worksPlans',
			url: 'works-plan',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
