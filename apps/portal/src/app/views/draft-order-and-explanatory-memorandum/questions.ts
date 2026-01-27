// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		draftDevelopmentConsentOrder: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Draft Development Consent Order',
			pageTitle: 'Draft Development Consent Order',
			question: 'Which documents relate to the draft development consent order?',
			fieldName: 'draftDevelopmentConsentOrder',
			url: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER,
			validators: [new RequiredValidator('Select the documents relating to the draft development consent order')]
		},
		siValidationReportSuccessEmail: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'SI Validation Report Success Email',
			pageTitle: 'SI Validation Report Success Email',
			question: 'Which documents relate to the SI validation report success email?',
			fieldName: 'siValidationReportSuccessEmail',
			url: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL,
			validators: [new RequiredValidator('Select the documents relating to the SI validation report success email')]
		},
		explanatoryMemorandum: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Explanatory Memorandum',
			pageTitle: 'Explanatory Memorandum',
			question: 'Which documents relate to the Explanatory Memorandum?',
			fieldName: 'explanatoryMemorandum',
			url: DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM,
			validators: [new RequiredValidator('Select the documents relating to the explanatory memorandum')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
