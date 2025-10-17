// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { APFP_REGULATION, DOCUMENT_SUB_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';

export const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'tif', 'tiff', 'doc', 'docx', 'xls', 'xlsx'];
export const ALLOWED_MIME_TYPES = [
	'application/pdf',
	'image/png',
	'image/jpeg',
	'image/tiff',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function getQuestions(documentTypeId: string) {
	const questions = {
		documentType: {
			type: COMPONENT_TYPES.RADIO,
			title: 'Select the document type',
			question: 'Select the document type',
			fieldName: 'documentType',
			url: 'document-type',
			options: referenceDataToRadioOptions(
				DOCUMENT_SUB_CATEGORY.filter((subCategory) => subCategory.categoryId === documentTypeId)
			),
			validators: [new RequiredValidator()]
		},
		apfpRegulation: {
			type: COMPONENT_TYPES.SELECT,
			title: 'Select the relevant APFP regulation',
			question: 'Select the relevant APFP regulation',
			hint: 'APFP refers to the Infrastructure Planning (Applications: Prescribed Forms and Procedure) Regulations 2009.',
			fieldName: 'apfpRegulation',
			url: 'regulation',
			validators: [new RequiredValidator()],
			options: [{ text: '', value: '' }, ...APFP_REGULATION.map((t) => ({ text: t.displayName, value: t.id }))]
		},
		isCertified: {
			type: COMPONENT_TYPES.BOOLEAN,
			title: 'Is the document certified?',
			question: 'Is the document certified?',
			fieldName: 'certified',
			url: 'document-certified',
			validators: [new RequiredValidator()]
		}
	};

	return createQuestions(questions, questionClasses, {});
}
