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
			validators: [new RequiredValidator('Select BACS, CHAPS or cheque')]
		},
		paymentReference: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Payment Reference',
			pageTitle: 'Payment Reference',
			question: 'Enter the payment reference',
			fieldName: 'paymentReference',
			url: 'payment-reference',
			validators: [
				new RequiredValidator('Enter the payment reference'),
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
			validators: [new RequiredValidator('Select yes if you are an agent acting on behalf of the applicant')]
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
		question: `Enter the ${prefix}'s organisation`,
		fieldName: `${prefix}Organisation`,
		url: `organisation`,
		validators: [
			new RequiredValidator(prefix === 'applicant' ? `Enter the ${prefix}’s organisation` : 'Enter your organisation'),
			new StringValidator({
				maxLength: { maxLength: 250, maxLengthMessage: 'Organisation must be 250 characters or less' },
				regex: {
					regex: /^[A-Za-z0-9'-, ]+$/,
					regexMessage:
						'Organisation must only contain letters a to z, numbers, apostrophes, hyphens, commas and spaces'
				}
			})
		]
	};
	questions[`${prefix}Name`] = {
		type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
		title: `${title} Name`,
		pageTitle: `${title} Name`,
		question: `Enter the ${prefix}'s name`,
		fieldName: `${prefix}Name`,
		url: `name`,
		validators: [
			new MultiFieldInputValidator({
				fields: [
					{
						fieldName: `${prefix}FirstName`,
						errorMessage: prefix === 'applicant' ? `Enter the ${prefix}’s first name` : 'Enter your first name',
						required: true,
						regex: {
							regex: /^[A-Za-z' -]+$/,
							regexMessage: 'First name must only contain letters a to z, apostrophes and hyphens'
						},
						maxLength: { maxLength: 250, minLengthMessage: 'First name must be 250 characters or less' }
					},
					{
						fieldName: `${prefix}LastName`,
						errorMessage: prefix === 'applicant' ? `Enter the ${prefix}’s last name` : 'Enter your last name',
						required: true,
						regex: {
							regex: /^[A-Za-z'-]+$/,
							regexMessage: 'Last name must only contain letters a to z, apostrophes and hyphens'
						},
						maxLength: { maxLength: 250, minLengthMessage: 'Last name must be 250 characters or less' }
					}
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
		question: `Enter the ${prefix}'s email address`,
		fieldName: `${prefix}EmailAddress`,
		url: `email-address`,
		validators: [
			new RequiredValidator('Enter an email address'),
			new StringValidator({
				regex: {
					regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
					regexMessage: 'Enter an email address in the correct format, like name@example.com'
				}
			})
		]
	};
	questions[`${prefix}Phone`] = {
		type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
		title: `${title} Phone Number`,
		pageTitle: `${title} Phone Number`,
		question: `Enter the ${prefix}'s phone number`,
		fieldName: `${prefix}Phone`,
		url: `phone`,
		validators: [
			new RequiredValidator('Enter a phone number'),
			new StringValidator({
				regex: {
					regex: /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
					regexMessage:
						'Enter a phone number in the correct format, like 01632 960 001, 07700 900 982 or +44 808 157 0192'
				}
			})
		]
	};
	questions[`${prefix}Address`] = {
		type: CUSTOM_COMPONENTS.FULL_ADDRESS,
		title: `${title} Address`,
		pageTitle: `${title} Address`,
		question: `Enter the ${prefix}'s address`,
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
