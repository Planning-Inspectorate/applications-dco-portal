import FileUpload from './file-upload/question.js';
import FullAddress from './full-address/question.js';
import SelectDocuments from './select-documents/question.js';
import GroupedMultiFieldInput from './grouped-multi-field-input/question.js';

export const CUSTOM_COMPONENTS = Object.freeze({
	FILE_UPLOAD: 'file-upload',
	FULL_ADDRESS: 'full-address',
	SELECT_DOCUMENTS: 'select-documents',
	GROUPED_MULTI_FIELD_INPUT: 'grouped-multi-field-input'
});

export const CUSTOM_COMPONENT_CLASSES = Object.freeze({
	[CUSTOM_COMPONENTS.FILE_UPLOAD]: FileUpload,
	[CUSTOM_COMPONENTS.FULL_ADDRESS]: FullAddress,
	[CUSTOM_COMPONENTS.SELECT_DOCUMENTS]: SelectDocuments,
	[CUSTOM_COMPONENTS.GROUPED_MULTI_FIELD_INPUT]: GroupedMultiFieldInput
});
