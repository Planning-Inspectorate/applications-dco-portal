// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		hasStatutoryNuisanceStatement: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project include a statutory nuisance statement?',
			question: 'Does the project include a statutory nuisance statement?',
			fieldName: 'hasStatutoryNuisanceStatement',
			url: 'has-statutory-nuisance-statement',
			validators: [new RequiredValidator('Select yes if the project could cause any statutory nuisances')]
		},
		statutoryNuisanceStatement: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the statutory nuisance statement?',
			question: 'Which documents relate to the statutory nuisance statement?',
			fieldName: 'statutoryNuisanceStatement',
			url: DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT,
			validators: [new RequiredValidator('Select the documents relating to the statutory nuisance statement')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
