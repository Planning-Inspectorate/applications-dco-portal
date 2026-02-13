import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		hasNaturalEnvironmentInformation: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Natural Environment Information',
			pageTitle: 'Natural Environment Information',
			question: 'Could the project affect any nature conservation, landscape, geological or water features?',
			fieldName: 'hasNaturalEnvironmentInformation',
			url: 'natural-environment-information',
			validators: [
				new RequiredValidator(
					'Select yes if the project will affect any nature conservation, landscape, geological or water features'
				)
			]
		},
		naturalEnvironmentInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Natural Environment Information Documents',
			pageTitle: 'Natural Environment Information Documents',
			question: 'Which documents relate to the nature conservation, landscape, geological or water features?',
			fieldName: 'naturalEnvironmentInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES,
			validators: [
				new RequiredValidator(
					'Select the documents relating to nature conservation, landscape, geological or water features'
				)
			]
		},
		hasHistoricEnvironmentInformation: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Historic Environment Information',
			pageTitle: 'Historic Environment Information',
			question: 'Could the project affect any historic environment sites or features?',
			fieldName: 'hasHistoricEnvironmentInformation',
			url: 'historic-environment-information',
			validators: [
				new RequiredValidator('Select yes if the project will affect any historic environment sites or features')
			]
		},
		historicEnvironmentInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Historic Environment Information Documents',
			pageTitle: 'Historic Environment Information Documents',
			question: 'Which documents relate to the historic environment sites or features?',
			fieldName: 'historicEnvironmentInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES,
			validators: [new RequiredValidator('Select the documents relating to historic environment sites or features')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
