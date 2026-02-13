// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { referenceDataToRadioOptionsWithHintText } from '@pins/dco-portal-lib/util/questions.ts';
import { USER_ROLES } from '../util.ts';

export function getQuestions() {
	const questions = {
		emailAddress: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			pageTitle: 'Enter their email address',
			title: 'Enter their email address',
			question: 'Enter their email address',
			fieldName: 'emailAddress',
			url: 'email-address',
			validators: [
				new RequiredValidator('Enter an email address'),
				new StringValidator({
					regex: {
						regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						regexMessage: 'Enter an email address in the correct format, like name@example.com'
					}
				})
			]
		},
		accessLevel: {
			type: COMPONENT_TYPES.RADIO,
			pageTitle: 'Select their access level',
			title: 'Select their access level',
			question: 'Select their access level',
			hint: 'There can only be up to 3 admins at any time',
			fieldName: 'accessLevel',
			url: 'access-level',
			options: referenceDataToRadioOptionsWithHintText(USER_ROLES),
			validators: [new RequiredValidator('Select standard or admin access level')]
		}
	};

	const classes = {
		...questionClasses
	};

	return createQuestions(questions, classes, {});
}
