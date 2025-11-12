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
import FullAddressValidator from '@pins/dco-portal-lib/forms/custom-components/full-address/full-address-validator.ts';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { PAYMENT_METHOD } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getQuestions() {
	const questions = {
		organisation: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Applicant Organisation',
			pageTitle: 'Applicant Organisation',
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
			title: 'Application Payment Method',
			pageTitle: 'Application Payment Method',
			question: 'Select how you paid the application fee',
			fieldName: 'paymentMethod',
			url: 'payment-method',
			options: referenceDataToRadioOptions(PAYMENT_METHOD),
			validators: [new RequiredValidator()]
		},
		paymentReference: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Payment Reference',
			pageTitle: 'Payment Reference',
			question: 'Enter the payment reference',
			fieldName: 'paymentReference',
			url: 'payment-reference',
			validators: [
				new RequiredValidator(),
				new StringValidator({
					maxLength: { maxLength: 18, maxLengthMessage: 'Payment reference must be 18 characters or less.' }
				})
			]
		},
		name: {
			type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
			title: 'Applicant Name',
			pageTitle: 'Applicant Name',
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
		emailAddress: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Applicant Email Address',
			pageTitle: 'Applicant Email Address',
			question: "Enter the applicant's email address",
			fieldName: 'emailAddress',
			url: 'email-address',
			validators: [
				new RequiredValidator(),
				new StringValidator({
					regex: {
						regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
						regexMessage: 'Please enter a valid email address'
					}
				})
			]
		},
		phone: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Applicant Phone Number',
			pageTitle: 'Applicant Phone Number',
			question: "Enter the applicant's phone number",
			fieldName: 'phone',
			url: 'phone',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 15, maxLengthMessage: 'Phone number must be 15 characters or less' },
					minLength: { minLength: 8, minLengthMessage: 'Phone number must be 8 characters or more' },
					regex: {
						regex: /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
						regexMessage: 'Please enter a valid phone number'
					}
				})
			]
		},
		address: {
			type: CUSTOM_COMPONENTS.FULL_ADDRESS,
			title: 'Applicant Address',
			pageTitle: 'Applicant Address',
			question: "Enter the applicant's address",
			fieldName: 'address',
			url: 'address',
			fieldLabels: { addressLine1: 'Building name or number', addressLine2: 'Street' },
			validators: [
				new FullAddressValidator({
					requiredFields: { addressLine1: true, addressLine2: true, townCity: true, postcode: true, country: true }
				})
			]
		},
		fax: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Applicant Fax Number',
			pageTitle: 'Applicant Fax Number',
			question: "Enter the applicant's fax number (optional)",
			fieldName: 'fax',
			url: 'fax'
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
