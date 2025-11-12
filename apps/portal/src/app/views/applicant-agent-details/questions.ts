// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import MultiFieldInputValidator from '@planning-inspectorate/dynamic-forms/src/validator/multi-field-input-validator.js';
// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { PAYMENT_METHOD } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		organisation: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: "Enter the applicant's organisation",
			question: "Enter the applicant's organisation",
			fieldName: 'organisation',
			url: 'organisation',
			validators: [
				new RequiredValidator(),
				new StringValidator({
					maxLength: { maxLength: 30 },
					regex: { regex: /^[A-Za-z ]+$/, regexMessage: 'Organisation name can only contain letters and spaces' }
				})
			]
		},
		paymentMethod: {
			type: COMPONENT_TYPES.RADIO,
			title: 'Tell us about the application fee payment',
			question: 'Select how you paid the application fee',
			fieldName: 'paymentMethod',
			url: 'payment-method',
			options: referenceDataToRadioOptions(PAYMENT_METHOD),
			validators: [new RequiredValidator()]
		},
		paymentReference: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Tell us about the application fee payment',
			question: 'Enter the payment reference',
			fieldName: 'paymentReference',
			url: 'payment-reference',
			validators: [new RequiredValidator(), new StringValidator({ maxLength: { maxLength: 18 } })]
		},
		name: {
			type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
			title: "Enter the applicant's name",
			question: "Enter the applicant's name",
			fieldName: 'name',
			url: 'name',
			validators: [
				new MultiFieldInputValidator({
					fields: [
						{ fieldName: 'firstName', errorMessage: 'Please enter a first name', required: true },
						{ fieldName: 'lastName', errorMessage: 'Please enter a last name', required: true }
					]
				})
			],
			inputFields: [
				{ fieldName: 'firstName', label: 'First name', type: COMPONENT_TYPES.SINGLE_LINE_INPUT },
				{ fieldName: 'lastName', label: 'Last name', type: COMPONENT_TYPES.SINGLE_LINE_INPUT }
			]
		},
		//TODO: validation on these two
		emailAddress: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: "Enter the applicant's email address",
			question: "Enter the applicant's email address",
			fieldName: 'emailAddress',
			url: 'email-address',
			validators: [new RequiredValidator()]
		},
		phoneNumber: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: "Enter the applicant's phone number",
			question: "Enter the applicant's phone number",
			fieldName: 'phoneNumber',
			url: 'phone-number',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses
	};

	return createQuestions(questions, classes, {});
}
