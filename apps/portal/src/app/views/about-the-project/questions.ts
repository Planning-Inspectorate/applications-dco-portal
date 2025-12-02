// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES } from '@pins/dco-portal-lib/forms/custom-components/index.ts';

export function getQuestions() {
	const questions = {
		description: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Project Description',
			pageTitle: 'Project Description',
			question: 'Describe the Project',
			fieldName: 'description',
			url: 'description',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		consentReason: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Project Consent Reason',
			pageTitle: 'Project Consent Reason',
			question: 'Explain why the project requires development consent',
			fieldName: 'consentReason',
			url: 'consent-reason',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
