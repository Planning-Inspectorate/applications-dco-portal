// @ts-expect-error - due to not having @types
import StringValidator from '@planning-inspectorate/dynamic-forms/src/validator/string-validator.js';
// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import MultiFieldInputValidator from '@planning-inspectorate/dynamic-forms/src/validator/multi-field-input-validator.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { CUSTOM_COMPONENTS, CUSTOM_COMPONENT_CLASSES } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import { PROJECT_SITE_TYPES } from './constants.ts';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

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
				new RequiredValidator('Enter a project description'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Project description must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Project description must be 2000 characters or less'
					}
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
				new RequiredValidator('Enter an explanation for why the project requires development consent'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Explanation must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Explanation must be 2000 characters or less'
					}
				})
			]
		},
		locationDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Project Location Description',
			pageTitle: 'Project Location Description',
			question: 'Describe the location or route of the project',
			fieldName: 'locationDescription',
			url: 'location-description',
			validators: [
				new RequiredValidator('Enter the project location or route'),
				new StringValidator({
					minLength: {
						minLength: 2,
						minLengthMessage: 'Location or route description must be 2 characters or more'
					},
					maxLength: {
						maxLength: 2000,
						maxLengthMessage: 'Location or route description be 2000 characters or less'
					}
				})
			]
		},
		singleOrLinear: {
			type: COMPONENT_TYPES.RADIO,
			title: 'Single or Linear',
			pageTitle: 'Single or Linear',
			question: 'Is the site single or linear?',
			fieldName: 'singleOrLinear',
			url: 'single-or-linear',
			options: referenceDataToRadioOptions(PROJECT_SITE_TYPES),
			validators: [new RequiredValidator('Select if the site is single or linear')]
		},
		singleGridReferences: {
			type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
			title: `Single Site Grid References`,
			pageTitle: `Single Site Grid References`,
			question: `Enter grid references`,
			fieldName: `singleSiteGridReferences`,
			url: `grid-references-single-site`,
			validators: [
				new MultiFieldInputValidator({
					fields: [
						{
							fieldName: `easting`,
							errorMessage: 'Enter an easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Easting grid reference must be 6 digits' }
						},
						{
							fieldName: `northing`,
							errorMessage: 'Enter a northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Northing grid reference must be 6 digits' }
						}
					]
				})
			],
			inputFields: [
				{ fieldName: `easting`, label: 'Easting', hint: `For example, 123456` },
				{ fieldName: `northing`, label: 'Northing', hint: `For example, 345678` }
			]
		},
		linearGridReferences: {
			type: CUSTOM_COMPONENTS.GROUPED_MULTI_FIELD_INPUT,
			title: `Linear Site Grid References`,
			pageTitle: `Linear Site Grid References`,
			question: `Enter grid references`,
			fieldName: `linearSiteGridReferences`,
			url: `grid-references-linear-site`,
			validators: [
				new MultiFieldInputValidator({
					fields: [
						{
							fieldName: `startEasting`,
							errorMessage: 'Enter the start easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Start easting grid reference must be 6 digits' }
						},
						{
							fieldName: `startNorthing`,
							errorMessage: 'Enter the start northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Start northing grid reference must be 6 digits' }
						},
						{
							fieldName: `middleEasting`,
							errorMessage: 'Enter the middle easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Middle easting grid reference must be 6 digits' }
						},
						{
							fieldName: `middleNorthing`,
							errorMessage: 'Enter the middle northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Middle northing grid reference must be 6 digits' }
						},
						{
							fieldName: `endEasting`,
							errorMessage: 'Enter the end easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'End easting grid reference must be 6 digits' }
						},
						{
							fieldName: `endNorthing`,
							errorMessage: 'Enter the end northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'End northing grid reference must be 6 digits' }
						}
					]
				})
			],
			inputGroups: [
				{
					title: 'Start',
					fields: [
						{ fieldName: `startEasting`, label: 'Easting' },
						{ fieldName: `startNorthing`, label: 'Northing' }
					]
				},
				{
					title: 'Middle',
					fields: [
						{ fieldName: `middleEasting`, label: 'Easting' },
						{ fieldName: `middleNorthing`, label: 'Northing' }
					]
				},
				{
					title: 'End',
					fields: [
						{ fieldName: `endEasting`, label: 'Easting' },
						{ fieldName: `endNorthing`, label: 'Northing' }
					]
				}
			]
		},
		hasAssociatedDevelopments: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Has Associated Developments',
			pageTitle: 'Has Associated Developments',
			question: 'Does the project include any associated developments?',
			fieldName: 'hasAssociatedDevelopments',
			url: 'has-associated-developments',
			validators: [new RequiredValidator('Select yes if the project includes any associated developments')]
		},
		associatedDevelopments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Associated Developments',
			pageTitle: 'Associated Developments',
			question: 'Which documents relate to the associated developments?',
			fieldName: 'associatedDevelopments',
			url: DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT,
			validators: [new RequiredValidator('Select the documents relating to the associated developments')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
