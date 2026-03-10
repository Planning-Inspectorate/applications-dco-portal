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
import { referenceDataToRadioOptionsWithHintText } from '@pins/dco-portal-lib/util/questions.ts';
import { PAYMENT_METHOD, PAYMENT_METHOD_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { QuestionProps } from '@planning-inspectorate/dynamic-forms/src/questions/question-props.js';
import type { FullAddressProps } from '@pins/dco-portal-lib/forms/custom-components/full-address/types.d.ts';
import type { ApplicantAgentDetailsPrefix, PaymentMethodWithHint } from './types.d.ts';

export function getQuestions() {
	const paymentMethodsWithHints = PAYMENT_METHOD.map((method) => {
		const methodWithHint: PaymentMethodWithHint = { ...method, hint: { text: '' } };
		if (methodWithHint.id === PAYMENT_METHOD_ID.BACS) {
			methodWithHint.hint = {
				text: `Bankers Automated Clearing Services (BACS) is a secure, electronic bank-to-bank transfer`
			};
		} else if (methodWithHint.id === PAYMENT_METHOD_ID.CHAPS) {
			methodWithHint.hint = {
				text: `Clearing House Automated Payment System (CHAPS) is often used for fast transfers of large sums of money`
			};
		}

		return methodWithHint;
	});

	const questions = {
		...contactDetailsQuestions('applicant'),
		...contactDetailsQuestions('agent'),
		paymentMethod: {
			type: COMPONENT_TYPES.RADIO,
			title: 'Payment method',
			question: 'Select how you paid the application fee',
			fieldName: 'paymentMethod',
			url: 'payment-method',
			options: referenceDataToRadioOptionsWithHintText(paymentMethodsWithHints),
			validators: [new RequiredValidator('Select BACS, CHAPS or cheque')]
		},
		paymentReference: {
			type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
			title: 'Payment reference',
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
			title: 'Are you an agent?',
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

export function contactDetailsQuestions(prefix: ApplicantAgentDetailsPrefix) {
	const questions: Record<string, unknown> = {};

	questions[`${prefix}Organisation`] = {
		type: COMPONENT_TYPES.SINGLE_LINE_INPUT,
		title: `Organisation`,
		question: getQuestionFormat(prefix, 'organisation'),
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
		title: `Name`,
		question: getQuestionFormat(prefix, 'name'),
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
						maxLength: { maxLength: 250, maxLengthMessage: 'First name must be 250 characters or less' }
					},
					{
						fieldName: `${prefix}LastName`,
						errorMessage: prefix === 'applicant' ? `Enter the ${prefix}’s last name` : 'Enter your last name',
						required: true,
						regex: {
							regex: /^[A-Za-z' -]+$/,
							regexMessage: 'Last name must only contain letters a to z, apostrophes and hyphens'
						},
						maxLength: { maxLength: 250, maxLengthMessage: 'Last name must be 250 characters or less' }
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
		title: `Email address`,
		question: getQuestionFormat(prefix, 'email address'),
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
		title: `Phone number`,
		question: getQuestionFormat(prefix, 'phone number'),
		fieldName: `${prefix}Phone`,
		url: `phone-number`,
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
		title: `Address`,
		question: getQuestionFormat(prefix, 'address'),
		fieldName: `${prefix}Address`,
		url: `address`,
		fieldLabels: { addressLine1: 'Building name or number', addressLine2: 'Street' },
		validators: [
			new FullAddressValidator({
				requiredFields: { addressLine1: true, addressLine2: true, townCity: true, postcode: true, country: true }
			})
		]
	};

	return questions as Record<string, QuestionProps | FullAddressProps>;
}

function getQuestionFormat(prefix: ApplicantAgentDetailsPrefix, fieldText: string) {
	switch (prefix) {
		case 'agent':
			return `Enter your ${fieldText}`;
		default:
			return `Enter the ${prefix}’s ${fieldText}`;
	}
}
