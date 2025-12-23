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
		hasEnvironmentalStatement: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Environmental Statement',
			question: 'Does the project require an environmental statement?',
			fieldName: 'hasEnvironmentalStatement',
			url: 'has-environmental-statement',
			validators: [new RequiredValidator()]
		},
		nonTechnicalSummary: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non-Technical Summary',
			question: 'Select the non-technical summary of the environmental statement?',
			fieldName: 'nonTechnicalSummary',
			html: 'views/environmental-impact-assessment/has-environmental-statement-question-description.html',
			url: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
