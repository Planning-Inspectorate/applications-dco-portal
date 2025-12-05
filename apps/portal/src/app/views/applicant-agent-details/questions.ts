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
import type { QuestionProps } from '@planning-inspectorate/dynamic-forms/src/questions/question-props.js';
import type { FullAddressProps } from '@pins/dco-portal-lib/forms/custom-components/full-address/types.d.ts';

export function getQuestions() {
	const questions = {
		...contactDetailsQuestions('applicant', 'Applicant'),
		...contactDetailsQuestions('agent', 'Agent'),
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
		isAgent: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Is Agent?',
			pageTitle: 'Is Agent',
			question: 'Are you an agent acting on behalf of the applicant?',
			fieldName: 'isAgent',
			url: 'is-agent',
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}

export function contactDetailsQuestions(prefix: string, title: string) {
	const questions: Record<string, QuestionProps | FullAddressProps> = {};

	questions[`${prefix}Organisation`] = {
		type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
		title: `${title} Organisation`,
		pageTitle: `${title} Organisation`,
		question: `Enter the ${title.toLocaleLowerCase()}'s organisation`,
		fieldName: `${prefix}Organisation`,
		url: `organisation`,
		validators: [
			new RequiredValidator(),
			new StringValidator({
				maxLength: { maxLength: 30 },
				regex: { regex: /^[A-Za-z ]+$/, regexMessage: 'Organisation name can only contain letters and spaces' }
			})
		]
	};
	questions[`${prefix}Name`] = {
		type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
		title: `${title} Name`,
		pageTitle: `${title} Name`,
		question: `Enter the ${title.toLocaleLowerCase()}'s name`,
		fieldName: `${prefix}Name`,
		url: `name`,
		validators: [
			new MultiFieldInputValidator({
				fields: [
					{ fieldName: `${prefix}FirstName`, errorMessage: 'Please enter a first name', required: true },
					{ fieldName: `${prefix}LastName`, errorMessage: 'Please enter a last name', required: true }
				]
			})
		],
		inputFields: [
			{ fieldName: `${prefix}FirstName`, label: 'First name' },
			{ fieldName: `${prefix}LastName`, label: 'Last name' }
		]
	};
	questions[`${prefix}EmailAddress`] = {
		type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
		title: `${title} Email Address`,
		pageTitle: `${title} Email Address`,
		question: `Enter the ${title.toLocaleLowerCase()}'s email address`,
		fieldName: `${prefix}EmailAddress`,
		url: `email-address`,
		validators: [
			new RequiredValidator(),
			new StringValidator({
				regex: {
					regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
					regexMessage: 'Please enter a valid email address'
				}
			})
		]
	};
	questions[`${prefix}Phone`] = {
		type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
		title: `${title} Phone Number`,
		pageTitle: `${title} Phone Number`,
		question: `Enter the ${title.toLocaleLowerCase()}'s phone number`,
		fieldName: `${prefix}Phone`,
		url: `phone`,
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
	};
	questions[`${prefix}Address`] = {
		type: CUSTOM_COMPONENTS.FULL_ADDRESS,
		title: `${title} Address`,
		pageTitle: `${title} Address`,
		question: `Enter the ${title.toLocaleLowerCase()}'s address`,
		fieldName: `${prefix}Address`,
		url: `address`,
		fieldLabels: { addressLine1: 'Building name or number', addressLine2: 'Street' },
		validators: [
			new FullAddressValidator({
				requiredFields: { addressLine1: true, addressLine2: true, townCity: true, postcode: true, country: true }
			})
		]
	};

	return questions;
}
