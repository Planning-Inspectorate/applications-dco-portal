import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		hasCrownLand: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Crown Land',
			pageTitle: 'Has Crown Land',
			question: 'Could the project affect any Crown land?',
			fieldName: 'hasCrownLand',
			url: 'has-crown-land',
			validators: [new RequiredValidator()]
		},
		crownLand: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Crown Land Documents',
			pageTitle: 'Crown Land Documents',
			question: 'Which documents identify the Crown land?',
			fieldName: 'crownLand',
			url: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN,
			validators: [new RequiredValidator()]
		},
		hasMeansOfAccess: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Means of Access',
			pageTitle: 'Has Means of Access',
			question: 'Could the project require changes to access or public rights of way?',
			fieldName: 'hasMeansOfAccess',
			url: 'has-means-of-access',
			validators: [new RequiredValidator()]
		},
		meansOfAccess: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Means of Access Documents',
			pageTitle: 'Means of Access Documents',
			question: 'Which documents identify changes to access or public rights of way?',
			fieldName: 'meansOfAccess',
			url: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
