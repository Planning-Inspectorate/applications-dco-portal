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
import HTML_TEMPLATES from './html-templates.ts';
import { SELECT_ALL_THAT_APPLY_HTML } from '../common-html-templates.ts';

export function getQuestions() {
	const questions = {
		hasEnvironmentalStatement: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Has Environmental Statement',
			question: 'Environmental Statement',
			html: HTML_TEMPLATES.HAS_ENVIRONMENTAL_STATEMENT_HTML,
			fieldName: 'hasEnvironmentalStatement',
			url: 'has-environmental-statement',
			validators: [new RequiredValidator('Select yes if the project requires an environmental statement')]
		},
		nonTechnicalSummary: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non-Technical Summary',
			question: 'Select the non-technical summary of the environmental statement',
			html: HTML_TEMPLATES.NON_TECHNICAL_SUMMARY_HTML,
			fieldName: 'nonTechnicalSummary',
			url: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
			validators: [
				new RequiredValidator(
					'Select the documents relating to the non-technical summary of the environmental statement'
				)
			]
		},
		hasScreeningDirection: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Screening Opinion or Direction',
			pageTitle: 'Has Screening Opinion or Direction',
			question: 'Have you sought or received a screening opinion or direction?',
			fieldName: 'hasScreeningDirection',
			url: 'has-screening-opinion-or-direction',
			validators: [new RequiredValidator('Select yes if you have sought or received a screening opinion or direction')]
		},
		screeningDirectionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Screening Opinion or Direction Documents',
			pageTitle: 'Screening Opinion or Direction Documents',
			question: 'Select the screening opinion or direction',
			fieldName: 'screeningDirectionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
			validators: [new RequiredValidator('Select any documents relating to the screening opinion or direction')]
		},
		hasScopingOpinion: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Scoping Opinion or Direction',
			pageTitle: 'Has Scoping Opinion or Direction',
			question: 'Have you sought or received a scoping opinion or direction?',
			fieldName: 'hasScopingOpinion',
			url: 'has-scoping-opinion-or-direction',
			validators: [new RequiredValidator('Select yes if you have sought or received a scoping opinion or direction')]
		},
		scopingOpinionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Scoping Opinion or Direction Documents',
			pageTitle: 'Scoping Opinion or Direction Documents',
			question: 'Select the scoping opinion or direction',
			fieldName: 'scopingOpinionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION,
			validators: [new RequiredValidator('Select any documents relating to the scoping opinion or direction')]
		},
		otherEnvironmentalDocuments: {
			type: COMPONENT_TYPES.CHECKBOX,
			title: 'Other Environmental Documents',
			pageTitle: 'Other Environmental Documents',
			question: 'What other types of environmental statement documents have you uploaded?',
			html: SELECT_ALL_THAT_APPLY_HTML,
			fieldName: 'otherEnvironmentalDocuments',
			url: 'other-environmental-documents',
			options: referenceDataToRadioOptions(OTHER_ENVIRONMENTAL_DOCUMENTS_SUBCATEGORY_ID_OPTIONS),
			validators: []
		},
		introductoryChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Introductory Chapters',
			pageTitle: 'Introductory Chapters',
			question: 'Introductory Chapters',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'introductoryChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS,
			validators: []
		},
		aspectChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Aspect Chapters',
			pageTitle: 'Aspect Chapters',
			question: 'Aspect Chapters',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'aspectChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS,
			validators: []
		},
		environmentStatementAppendices: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Environmental Statement Appendices',
			pageTitle: 'Environmental Statement Appendices',
			question: 'Environmental Statement Appendices',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'environmentStatementAppendices',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES,
			validators: []
		},
		environmentStatementFigures: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Environmental Statement Figures',
			pageTitle: 'Environmental Statement Figures',
			question: 'Environmental Statement Figures',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'environmentStatementFigures',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES,
			validators: []
		},
		modelInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Model Information',
			pageTitle: 'Model Information',
			question: 'Model Information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'modelInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION,
			validators: []
		},
		anyOtherMediaInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Any Other Media Information',
			pageTitle: 'Any Other Media Information',
			question: 'Any Other Media Information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'anyOtherMediaInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
			validators: []
		},
		confidentialDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Confidential Documents',
			pageTitle: 'Confidential Documents',
			question: 'Confidential Documents',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'confidentialDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS,
			validators: []
		},
		sensitiveInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Sensitive Information',
			pageTitle: 'Sensitive Information',
			question: 'Sensitive Information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'sensitiveInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION,
			validators: []
		},
		notifyingConsultationBodies: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Notifying Consultation Bodies',
			pageTitle: 'Notifying Consultation Bodies',
			html: HTML_TEMPLATES.NOTIFYING_CONSULTATION_BODIES_HTML,
			question: 'Notifying consultation bodies',
			fieldName: 'notifyingConsultationBodies',
			url: 'notifying-consultation-bodies',
			validators: [
				new RequiredAnswerValidator({
					requiredAnswers: [BOOLEAN_OPTIONS.YES],
					emptyAnswerErrorMessage: 'Select yes if you’ve notified the consultation bodies',
					requiredAnswerErrorMessage: 'You must notify the consultation bodies about the project'
				})
			]
		},
		notifyingOtherPeople: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Notifying Other People',
			pageTitle: 'Notifying Other People',
			html: HTML_TEMPLATES.NOTIFYING_OTHER_PEOPLE_HTML,
			question: 'Notifying other people regulated identified under Regulation 11(1)(c)',
			fieldName: 'notifyingOtherPeople',
			url: 'notifying-other-people',
			validators: [new RequiredValidator('Select yes if you’ve notified other people under Regulation 11(1)(c)')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
