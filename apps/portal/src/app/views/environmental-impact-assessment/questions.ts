import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { OTHER_ENVIRONMENTAL_DOCUMENTS_SUBCATEGORY_ID_OPTIONS } from './constants.ts';
import HTML_TEMPLATES from './html-templates.ts';

export function getQuestions() {
	const questions = {
		hasEnvironmentalStatement: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Does the project require an environmental statement?',
			question: 'Environmental statement',
			pageTitle: 'Does the project require an environmental statement?',
			html: HTML_TEMPLATES.HAS_ENVIRONMENTAL_STATEMENT_HTML,
			fieldName: 'hasEnvironmentalStatement',
			url: 'environmental-statement',
			validators: [new RequiredValidator('Select yes if the project requires an environmental statement')]
		},
		nonTechnicalSummary: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Non-technical summary',
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
			title: 'Have you sought or received a screening opinion or direction?',
			question: 'Have you sought or received a screening opinion or direction?',
			fieldName: 'hasScreeningDirection',
			url: 'has-screening-opinion-or-direction',
			validators: [new RequiredValidator('Select yes if you have sought or received a screening opinion or direction')]
		},
		screeningDirectionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Screening opinion or direction documents',
			question: 'Select the screening opinion or direction',
			fieldName: 'screeningDirectionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
			validators: [new RequiredValidator('Select any documents relating to the screening opinion or direction')]
		},
		hasScopingOpinion: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Have you sought or received a scoping opinion or direction?',
			question: 'Have you sought or received a scoping opinion or direction?',
			fieldName: 'hasScopingOpinion',
			url: 'has-scoping-opinion-or-direction',
			validators: [new RequiredValidator('Select yes if you have sought or received a scoping opinion or direction')]
		},
		scopingOpinionDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Scoping opinion or direction documents',
			question: 'Select the scoping opinion or direction',
			fieldName: 'scopingOpinionDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION,
			validators: [new RequiredValidator('Select any documents relating to the scoping opinion or direction')]
		},
		otherEnvironmentalDocuments: {
			type: COMPONENT_TYPES.CHECKBOX,
			title: 'Other types of environmental statement documents uploaded',
			question: 'What other types of environmental statement documents have you uploaded? (optional)',
			description: 'Select all that apply',
			fieldName: 'otherEnvironmentalDocuments',
			url: 'environmental-statement-document-types',
			options: referenceDataToRadioOptions(OTHER_ENVIRONMENTAL_DOCUMENTS_SUBCATEGORY_ID_OPTIONS)
		},
		introductoryChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Introductory chapters',
			question: 'Introductory chapters',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'introductoryChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS,
			validators: [new RequiredValidator('Select the documents forming the introductory chapters')]
		},
		aspectChapters: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Aspect chapters',
			question: 'Aspect chapters',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'aspectChapters',
			url: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS,
			validators: [new RequiredValidator('Select the documents forming the aspect chapters')]
		},
		environmentStatementAppendices: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Appendices',
			question: 'Environmental statement appendices',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'environmentStatementAppendices',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES,
			validators: [new RequiredValidator('Select the documents forming the appendices')]
		},
		environmentStatementFigures: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Figures',
			question: 'Environmental statement figures',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'environmentStatementFigures',
			url: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES,
			validators: [new RequiredValidator('Select the documents forming the environmental statement figures')]
		},
		modelInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Model information',
			question: 'Model information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'modelInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION,
			validators: [new RequiredValidator('Select the documents forming the model information')]
		},
		anyOtherMediaInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Media information',
			question: 'Any other media information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'anyOtherMediaInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
			validators: [new RequiredValidator('Select the documents forming the media information')]
		},
		confidentialDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Confidential documents',
			question: 'Confidential documents',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'confidentialDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS,
			validators: [new RequiredValidator('Select any confidential documents')]
		},
		sensitiveInformation: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Sensitive information',
			question: 'Sensitive information',
			html: HTML_TEMPLATES.OPTIONAL_SUBCATEGORY_SUBTITLE_HTML,
			fieldName: 'sensitiveInformation',
			url: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION,
			validators: [new RequiredValidator('Select any documents relating to sensitive information')]
		},
		notifyingConsultationBodies: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Have you notified the consultation bodies about the project?',
			html: HTML_TEMPLATES.NOTIFYING_CONSULTATION_BODIES_HTML,
			question: 'Notifying consultation bodies',
			pageTitle: 'Have you notified the consultation bodies about the project?',
			fieldName: 'notifyingConsultationBodies',
			url: 'notifying-consultation-bodies',
			validators: [new RequiredValidator("Select yes if you've notified the consultation bodies")]
		},
		whyNotNotifyingConsultationBodies: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Explanation for not notifying the consultation bodies',
			question: 'Explain why you have not notified the consultation bodies about the project',
			fieldName: 'whyNotNotifyingConsultationBodies',
			url: 'explain-why-not-notified-consultation-bodies',
			validators: [
				new RequiredValidator(
					'Enter an explanation for why you have not notified the consultation bodies about the project'
				),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Explanation must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Explanation must be 2000 characters or less'
					}
				})
			]
		},
		notifiedOtherPeople: {
			type: CUSTOM_COMPONENTS.DESCRIPTIVE_BOOLEAN,
			title: 'Have you notified any other people under Regulation 11(1)(c) about the project?',
			html: HTML_TEMPLATES.NOTIFYING_OTHER_PEOPLE_HTML,
			question: 'Notifying other people regulated identified under Regulation 11(1)(c)',
			pageTitle: 'Have you notified any other people under Regulation 11(1)(c) about the project?',
			fieldName: 'notifiedOtherPeople',
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
