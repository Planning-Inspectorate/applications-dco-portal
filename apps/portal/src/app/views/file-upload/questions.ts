// @ts-expect-error - due to not having @types
import RequiredValidator from '@planning-inspectorate/dynamic-forms/src/validator/required-validator.js';
// @ts-expect-error - due to not having @types
import { createQuestions } from '@planning-inspectorate/dynamic-forms/src/questions/create-questions.js';
// @ts-expect-error - due to not having @types
import { questionClasses } from '@planning-inspectorate/dynamic-forms/src/questions/questions.js';
// @ts-expect-error - due to not having @types
import { COMPONENT_TYPES } from '@planning-inspectorate/dynamic-forms';
// @ts-expect-error - due to not having @types
import DocumentUploadValidator from '@planning-inspectorate/dynamic-forms/src/validator/document-upload-validator.js';
import { referenceDataToRadioOptions } from '@pins/dco-portal-lib/util/questions.ts';
import { APFP_REGULATION, DOCUMENT_SUB_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { CUSTOM_COMPONENT_CLASSES, CUSTOM_COMPONENTS } from '@pins/dco-portal-lib/forms/custom-components/index.ts';
import {
	ALLOWED_EXTENSIONS,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE
} from '@pins/dco-portal-lib/forms/custom-components/file-upload/constants.ts';

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
			fieldName: 'isCertified',
			url: 'document-certified',
			validators: [new RequiredValidator()]
		},
		fileUpload: {
			type: CUSTOM_COMPONENTS.FILE_UPLOAD,
			title: 'Upload your documents',
			question: 'Upload your documents',
			fieldName: 'fileUpload',
			url: 'upload-documents',
			allowedFileExtensions: ALLOWED_EXTENSIONS,
			allowedMimeTypes: ALLOWED_MIME_TYPES,
			maxFileSizeValue: MAX_FILE_SIZE,
			maxFileSizeString: '100MB',
			documentTypeId,
			validators: [new DocumentUploadValidator('fileUpload')]
		}
	};

	const classes = {
		...questionClasses,
		...CUSTOM_COMPONENT_CLASSES
	};

	return createQuestions(questions, classes, {});
}
