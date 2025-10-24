import FileUpload from './file-upload/question.js';

export const CUSTOM_COMPONENTS = Object.freeze({
	FILE_UPLOAD: 'file-upload'
});

export const CUSTOM_COMPONENT_CLASSES = Object.freeze({
	[CUSTOM_COMPONENTS.FILE_UPLOAD]: FileUpload
});
