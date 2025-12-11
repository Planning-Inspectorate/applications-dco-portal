import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';

export function getQuestions() {
	const questions = {
		hasNaturalEnvironmentInformation: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Natural Environment Information',
			pageTitle: 'Has Natural Environment Information',
			question: 'Could the project affect any nature conservation, landscape, geological or water features?',
			fieldName: 'hasNaturalEnvironmentInformation',
			url: 'natural-environment-information',
			validators: [new RequiredValidator()]
		},
		naturalEnvironmentInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Natural Environment Information',
			pageTitle: 'Natural Environment Information',
			question: 'Which documents relate to the nature conservation, landscape, geological or water features?',
			fieldName: 'naturalEnvironmentInformation',
			url: 'plans-of-statutory-and-non-statutory-sites-or-features',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
