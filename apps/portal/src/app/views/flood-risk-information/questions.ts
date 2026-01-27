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
		hasFloodRiskAssessment: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project include any flood risk assessments?',
			question: 'Does the project include any flood risk assessments?',
			fieldName: 'hasFloodRiskAssessment',
			url: 'has-flood-risk-assessment',
			validators: [new RequiredValidator('Select yes if the project requires a flood risk assessment')]
		},
		floodRiskAssessment: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the flood risk assessment?',
			question: 'Which documents relate to the flood risk assessment?',
			fieldName: 'floodRiskAssessment',
			url: DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT,
			validators: [new RequiredValidator('Select the documents relating to the flood risk assessment')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
