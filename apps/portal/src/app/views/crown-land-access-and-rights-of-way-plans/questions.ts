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
		hasCrownLand: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Could the project affect any Crown land?',
			question: 'Could the project affect any Crown land?',
			fieldName: 'hasCrownLand',
			url: 'has-crown-land',
			validators: [new RequiredValidator('Select yes if the project could affect Crown land')]
		},
		crownLand: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Crown land documents',
			question: 'Which documents identify the Crown land?',
			hint: 'Select all that apply',
			fieldName: 'crownLand',
			url: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN,
			validators: [new RequiredValidator('Select the documents relating to Crown land')]
		},
		hasMeansOfAccess: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Could the project require changes to access or public rights of way?',
			question: 'Could the project require changes to access or public rights of way?',
			fieldName: 'hasMeansOfAccess',
			url: 'has-means-of-access',
			validators: [
				new RequiredValidator('Select yes if the project requires changes to access or public rights of way')
			]
		},
		meansOfAccess: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Changes to access or public rights of way documents',
			question: 'Which documents identify changes to access or public rights of way?',
			hint: 'Select all that apply',
			fieldName: 'meansOfAccess',
			url: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN,
			validators: [new RequiredValidator('Select the documents relating to access and public rights of way changes')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
