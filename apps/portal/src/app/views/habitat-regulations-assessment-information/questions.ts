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

const HRA_DESCRIPTION = `
		<p class="govuk-body">These could include:</p>
		<ul class="govuk-list govuk-list--bullet">
		<li>a brief statement that the project won't affect any European or Ramsar sites</li>
		<li>a No Significant Effects Report (NSER) where screening shows likely significant effects would not occur</li>
		<li>an HRA report where screening shows likely significant effects would occur, including information for derogation tests where applicable</li>
		</ul>
		<h2 class="govuk-heading-m">Which documents relate to the HRA process?</h2>
	`;

export function getQuestions() {
	const questions = {
		hasHabitatRegulationsAssessmentReport: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project require a Habitat Regulations Assessment (HRA) report?',
			question: 'Does the project require a Habitat Regulations Assessment (HRA) report?',
			fieldName: 'hasHabitatRegulationsAssessmentReport',
			hint: 'An HRA report is required if the project may have a likely significant effect on a European site or Ramsar site',
			url: 'hra-report',
			validators: [new RequiredValidator('Select yes if the project requires a Habitat Regulations Assessment report')]
		},
		habitatRegulationsAssessmentScreeningReport: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Habitat Regulations Assessment (HRA) documents',
			question: 'Habitat Regulations Assessment (HRA) documents',
			html: HRA_DESCRIPTION,
			fieldName: 'habitatRegulationsAssessmentScreeningReport',
			url: DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT,
			validators: [new RequiredValidator('Select the documents relating to the Habitat Regulations Assessment process')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
