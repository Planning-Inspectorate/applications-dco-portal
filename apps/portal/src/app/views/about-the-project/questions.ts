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
// @ts-expect-error - due to not having @types
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
			html: 'views/prepopulated-data-template.html',
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
		},
		locationDescription: {
			type: COMPONENT_TYPES.TEXT_ENTRY,
			title: 'Project Location Description',
			pageTitle: 'Project Location Description',
			question: 'Describe the location or route of the project',
			fieldName: 'locationDescription',
			html: 'views/prepopulated-data-template.html',
			url: 'location-description',
			validators: [
				new StringValidator({
					maxLength: { maxLength: 2000 },
					minLength: { minLength: 2 }
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
			validators: [new RequiredValidator()]
		},
		singleGridReferences: {
			type: COMPONENT_TYPES.MULTI_FIELD_INPUT,
			title: `Single Site Grid References`,
			pageTitle: `Single Site Grid References`,
			question: `Enter grid references`,
			fieldName: `singleSiteGridReferences`,
			html: 'views/prepopulated-data-template.html',
			url: `grid-references-single-site`,
			validators: [
				new MultiFieldInputValidator({
					fields: [
						{
							fieldName: `easting`,
							errorMessage: 'Please enter easting grid references',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `northing`,
							errorMessage: 'Please enter northing grid references',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
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
							errorMessage: 'Please enter a start easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `startNorthing`,
							errorMessage: 'Please enter a start northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `middleEasting`,
							errorMessage: 'Please enter a middle easting grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `middleNorthing`,
							errorMessage: 'Please enter a middle northing grid reference',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `endEasting`,
							errorMessage: 'Please enter an end easting grid references',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
						},
						{
							fieldName: `endNorthing`,
							errorMessage: 'Please enter an end northing grid references',
							required: true,
							regex: { regex: /^[0-9]{6}$/, regexMessage: 'Please enter a 6 digit numeric grid reference' }
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
			validators: [new RequiredValidator()]
		},
		associatedDevelopments: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Associated Developments',
			pageTitle: 'Associated Developments',
			question: 'Which documents relate to the associated developments?',
			fieldName: 'associatedDevelopments',
			url: DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT,
			validators: [new RequiredValidator()]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
