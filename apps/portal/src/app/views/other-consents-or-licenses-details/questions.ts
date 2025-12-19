// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		hasOtherConsents: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Other Consents or Licences',
			pageTitle: 'Has Other Consents Or Licences',
			question: 'Does the project require other consents or licences?',
			fieldName: 'hasOtherConsents',
			url: 'has-other-consents',
			validators: [new RequiredValidator()]
		},
		otherConsentsDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Other Consents or Licences Description',
			pageTitle: 'Other Consents or Licences Description',
			question: 'Other Consents or Licences required',
			label: 'What other consents or licences does the project require?',
			fieldName: 'otherConsentsDescription',
			url: 'other-consents-description',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
				})
			]
		},
		otherConsentsDocuments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Other Consents or Licences Documents',
			pageTitle: 'Other Consents or Licences Documents',
			question: 'Which documents identify the other consents or licences?',
			fieldName: 'otherConsentsDocuments',
			url: DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
