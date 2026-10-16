import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import {
	COMPONENT_TYPES,
	createQuestions,
	questionClasses,
	RequiredValidator
} from '@planning-inspectorate/dynamic-forms';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		hasFloodRiskAssessment: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project require a flood risk assessment?',
			question: 'Does the project require a flood risk assessment?',
			fieldName: 'hasFloodRiskAssessment',
			url: 'has-flood-risk-assessment',
			validators: [new RequiredValidator('Select yes if the project requires a flood risk assessment')]
		},
		floodRiskAssessment: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Flood risk assessment',
			question: 'Select the flood risk assessment',
			hint: 'This may be an appendix to the Environmental Statement or a separate document',
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
