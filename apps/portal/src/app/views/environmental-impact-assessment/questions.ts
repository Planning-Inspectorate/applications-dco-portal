import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import RequiredAnswerValidator from '@pins/dco-portal-lib/forms/custom-components/required-answer-validator.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { OTHER_ENVIRONMENTAL_DOCUMENTS_SUBCATEGORY_ID_OPTIONS } from './constants.ts';

export function getQuestions() {
	const questions = {
		hasEnvironmentalStatement: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Has Environmental Statement',
			question: 'Environmental Statement',
			html: 'views/environmental-impact-assessment/html/has-environmental-statement-question.html',
			fieldName: 'hasEnvironmentalStatement',
			url: 'has-environmental-statement',
			validators: [new RequiredValidator()]
		},
		nonTechnicalSummary: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non-Technical Summary',
			question: 'Select the non-technical summary of the environmental statement?',
			fieldName: 'nonTechnicalSummary',
			hint: 'The environmental statement must include a non-technical summary.',
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
		},
		otherEnvironmentalDocuments: {
			type: COMPONENT_TYPES.CHECKBOX,
			title: 'Other Environmental Documents',
			pageTitle: 'Other Environmental Documents',
			question: 'What other types of environmental statement documents have you uploaded?',
			hint: 'Select all that apply',
			fieldName: 'otherEnvironmentalDocuments',
			url: 'other-environmental-documents',
			options: referenceDataToRadioOptions(OTHER_ENVIRONMENTAL_DOCUMENTS_SUBCATEGORY_ID_OPTIONS),
			validators: [new RequiredValidator()]
		},
		introductoryChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Introductory Chapters',
			pageTitle: 'Introductory Chapters',
			question: 'Introductory Chapters',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'introductoryChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS,
			validators: [new RequiredValidator()]
		},
		aspectChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Aspect Chapters',
			pageTitle: 'Aspect Chapters',
			question: 'Aspect Chapters',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'aspectChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS,
			validators: [new RequiredValidator()]
		},
		environmentStatementAppendices: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Environmental Statement Appendices',
			pageTitle: 'Environmental Statement Appendices',
			question: 'Environmental Statement Appendices',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'environmentStatementAppendices',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES,
			validators: [new RequiredValidator()]
		},
		environmentStatementFigures: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Environmental Statement Figures',
			pageTitle: 'Environmental Statement Figures',
			question: 'Environmental Statement Figures',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'environmentStatementFigures',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES,
			validators: [new RequiredValidator()]
		},
		modelInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Model Information',
			pageTitle: 'Model Information',
			question: 'Model Information',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'modelInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION,
			validators: [new RequiredValidator()]
		},
		anyOtherMediaInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Any Other Media Information',
			pageTitle: 'Any Other Media Information',
			question: 'Any Other Media Information',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'anyOtherMediaInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
			validators: [new RequiredValidator()]
		},
		confidentialDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Confidential Documents',
			pageTitle: 'Confidential Documents',
			question: 'Confidential Documents',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'confidentialDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS,
			validators: [new RequiredValidator()]
		},
		sensitiveInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Sensitive Information',
			pageTitle: 'Sensitive Information',
			question: 'Sensitive Information',
			html: 'views/environmental-impact-assessment/html/optional-subcategory-subtitle.html',
			fieldName: 'sensitiveInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION,
			validators: [new RequiredValidator()]
		},
		notifyingConsultationBodies: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Notifying Consultation Bodies',
			pageTitle: 'Notifying Consultation Bodies',
			html: 'views/environmental-impact-assessment/html/notifying-consultation-bodies-question.html',
			question: 'Notifying consultation bodies',
			fieldName: 'notifyingConsultationBodies',
			url: 'notifying-consultation-bodies',
			validators: [
				new RequiredAnswerValidator({
					requiredAnswers: [BOOLEAN_OPTIONS.YES],
					errorMessage: 'You must notify the consultation bodies about the project before continuing'
				})
			]
		},
		notifyingOtherPeople: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Notifying Other People',
			pageTitle: 'Notifying Other People',
			html: 'views/environmental-impact-assessment/html/notifying-other-people-question.html',
			question: 'Notifying other people regulated identified under Regulation 11(1)(c)',
			fieldName: 'notifyingOtherPeople',
			url: 'notifying-other-people',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
