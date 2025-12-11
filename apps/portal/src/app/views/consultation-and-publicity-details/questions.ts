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
		consultationReport: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the consultation report?',
			question: 'Which documents relate to the consultation report?',
			fieldName: 'consultationReport',
			url: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT,
			validators: [new RequiredValidator()]
		},
		consultationReportAppendices: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the newspaper notices?',
			question: 'Which documents relate to the newspaper notices?',
			fieldName: 'consultationReportAppendices',
			url: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
