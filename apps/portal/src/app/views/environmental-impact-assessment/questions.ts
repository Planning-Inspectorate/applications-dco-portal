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
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Has Environmental Statement',
			question: 'Environmental Statement',
			html: 'views/environmental-impact-assessment/has-environmental-statement-question.html',
			fieldName: 'hasEnvironmentalStatement',
			url: 'has-environmental-statement',
			validators: [new RequiredValidator()]
		},
		nonTechnicalSummary: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non-Technical Summary',
			question: 'Select the non-technical summary of the environmental statement?',
			fieldName: 'nonTechnicalSummary',
			url: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
			validators: [new RequiredValidator()]
		},
		hasScreeningDirection: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Screening Opinion or Direction',
			pageTitle: 'Has Screening Opinion or Direction',
			question: 'Have you sought or recieved a screening opinion or direction?',
			fieldName: 'hasScreeningDirection',
			url: 'has-screening-opinion-or-direction',
			validators: [new RequiredValidator()]
		},
		screeningDirectionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Screening Opinion or Direction Documents',
			pageTitle: 'Screening Opinion or Direction Documents',
			question: 'Select the screening opinion or direction',
			fieldName: 'screeningDirectionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
			validators: [new RequiredValidator()]
		},
		hasScopingOpinion: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Scoping Opinion or Direction',
			pageTitle: 'Has Scoping Opinion or Direction',
			question: 'Have you sought or recieved a scoping opinion or direction?',
			fieldName: 'hasScopingOpinion',
			url: 'has-scoping-opinion-or-direction',
			validators: [new RequiredValidator()]
		},
		scopingOpinionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Scoping Opinion or Direction Documents',
			pageTitle: 'Scoping Opinion or Direction Documents',
			question: 'Select the scoping opinion or direction',
			fieldName: 'scopingOpinionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
