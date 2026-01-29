// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
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
		compulsoryAcquisition: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Does the project include any compulsory acquisition of land, an interest in land, or rights over land?',
			question:
				'Does the project include any compulsory acquisition of land, an interest in land, or rights over land?',
			fieldName: 'compulsoryAcquisition',
			url: 'compulsory-acquisition',
			validators: [
				new RequiredValidator(
					'Select yes if the project includes compulsory acquisition of land, an interest in land or rights over land'
				)
			]
		},
		statementOfReasons: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the statement of reasons?',
			question: 'Which documents relate to the statement of reasons?',
			fieldName: 'statementOfReasons',
			url: DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS,
			validators: [new RequiredValidator('Select the documents relating to the statement of reasons')]
		},
		fundingStatement: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the funding statement?',
			question: 'Which documents relate to the funding statement?',
			fieldName: 'fundingStatement',
			url: DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT,
			validators: [new RequiredValidator('Select the documents relating to the funding statement')]
		},
		bookOfReference: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the book of reference?',
			question: 'Which documents relate to the book of reference?',
			fieldName: 'bookOfReference',
			url: DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5,
			validators: [new RequiredValidator('Select the documents relating to the book of reference')]
		},
		landAndRightsNegotiationsTracker: {
			type: CUSTOM_COMPONENTS.SELECT_DOCUMENTS,
			title: 'Which documents relate to the land and rights negotiations tracker?',
			question: 'Which documents relate to the land and rights negotiations tracker?',
			fieldName: 'landAndRightsNegotiationsTracker',
			url: DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER,
			validators: [new RequiredValidator('Select the documents relating to the land and rights negotiations tracker')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
