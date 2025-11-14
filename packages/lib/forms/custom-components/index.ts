import FileUpload from './file-upload/question.js';
import FullAddress from './full-address/question.js';

export const CUSTOM_COMPONENTS = Object.freeze({
	FILE_UPLOAD: 'file-upload',
	FULL_ADDRESS: 'full-address'
});

export const CUSTOM_COMPONENT_CLASSES = Object.freeze({
	[CUSTOM_COMPONENTS.FILE_UPLOAD]: FileUpload,
	[CUSTOM_COMPONENTS.FULL_ADDRESS]: FullAddress
});
