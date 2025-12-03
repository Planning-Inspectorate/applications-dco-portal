// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';

export function getQuestions() {
	const questions = {
		europeanAndRamsarSites: {
			type: COMPONENT_TYPES.BOOLEAN,
			title:
				'Does the project include any European sites that the conservation of habitats and species regulations are relevant to the application?',
			question:
				'Does the project include any European sites that the conservation of habitats and species regulations are relevant to the application?',
			fieldName: 'europeanAndRamsarSites',
			url: 'european-and-ramsar-sites',
			validators: [new RequiredValidator()]
		},
		habitatRegulationsAssessmentScreeningReport: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the habitat regulations assessment screening report?',
			question: 'Which documents relate to the habitat regulations assessment screening report?',
			fieldName: 'habitatRegulationsAssessmentScreeningReport',
			url: 'habitat-regulations-assessment-screening-report',
			validators: [new RequiredValidator()]
		},
		hasReportToInformAppropriateAssessment: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project include any report to inform appropriate assessment?',
			question: 'Does the project include any report to inform appropriate assessment?',
			fieldName: 'hasReportToInformAppropriateAssessment',
			url: 'has-report-to-inform-appropriate-assessment',
			validators: [new RequiredValidator()]
		},
		reportToInformAppropriateAssessment: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the report to inform appropriate assessment?',
			question: 'Which documents relate to the report to inform appropriate assessment?',
			fieldName: 'reportToInformAppropriateAssessment',
			url: 'report-to-inform-appropriate-assessment',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
