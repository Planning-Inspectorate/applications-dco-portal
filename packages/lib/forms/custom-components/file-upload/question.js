import { Question } from '@planning-inspectorate/dynamic-forms/src/questions/question.js';
import { nl2br } from '@planning-inspectorate/dynamic-forms/src/lib/utils.js';
import { Buffer } from 'node:buffer';

const REDACTED_FLAG = 'Redacted';

/**
 * @class
 */
export default class FileUpload extends Question {
	constructor({
		documentTypeId,
		allowedFileExtensions,
		allowedMimeTypes,
		maxFileSizeValue,
		maxFileSizeString,
		showUploadWarning,
		...params
	}) {
		super({
			...params,
			viewFolder: 'custom-components/file-upload'
		});

		this.documentTypeId = documentTypeId;
		this.allowedFileExtensions = allowedFileExtensions;
		this.allowedMimeTypes = allowedMimeTypes;
		this.maxFileSizeValue = maxFileSizeValue;
		this.maxFileSizeString = maxFileSizeString;
		this.showUploadWarning = showUploadWarning;
	}

	prepQuestionForRendering(section, journey, customViewData, payload) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		viewModel.question.value = payload ? payload[viewModel.question.fieldName] : viewModel.question.value;

		const uploadedFiles = customViewData?.files?.[this.documentTypeId]?.uploadedFiles ?? [];

		viewModel.uploadedFiles = uploadedFiles;
		viewModel.uploadedFilesEncoded = Buffer.from(JSON.stringify(uploadedFiles), 'utf-8').toString('base64');

		viewModel.question.documentTypeId = this.documentTypeId;
		viewModel.question.allowedFileExtensions = this.allowedFileExtensions;
		viewModel.question.allowedMimeTypes = this.allowedMimeTypes;
		viewModel.question.maxFileSizeValue = this.maxFileSizeValue;
		viewModel.question.maxFileSizeString = this.maxFileSizeString;
		viewModel.question.showUploadWarning = this.showUploadWarning;

		return viewModel;
	}

	checkForValidationErrors(req, sectionObj, journey) {
		const { session = {}, body = {}, params, originalUrl } = req;
		const { errors: bodyErrors = {}, errorSummary: bodyErrorSummary = [] } = body;
		const { errors: sessionErrors = {}, errorSummary: sessionErrorSummary = [] } = session;

		const hasBodyErrors = bodyErrorSummary.length > 0;
		const hasSessionErrors = sessionErrorSummary.length > 0;

		if (hasBodyErrors || hasSessionErrors) {
			return this.prepQuestionForRendering(sectionObj, journey, {
				id: params.id || params.applicationId,
				currentUrl: originalUrl,
				files: session.files,
				errors: hasBodyErrors ? bodyErrors : sessionErrors,
				errorSummary: hasBodyErrors ? bodyErrorSummary : sessionErrorSummary
			});
		}
	}

	formatAnswerForSummary(sectionSegment, journey, answer) {
		const hasFiles = Array.isArray(answer) && answer.length > 0;
		const value = hasFiles ? nl2br(answer.map((file) => file.fileName).join('\n')) : '-';
		const isRedactedField = this.fieldName.includes(REDACTED_FLAG);

		return [
			{
				key: this.title,
				value,
				action: isRedactedField ? null : this.getAction(sectionSegment, journey, answer)
			}
		];
	}

	async getDataToSave(req, journeyResponse) {
		let responseToSave = { answers: {} };

		responseToSave.answers[this.fieldName] = req.session.files?.[this.documentTypeId]?.uploadedFiles;
		journeyResponse.answers[this.fieldName] = responseToSave.answers[this.fieldName];

		return responseToSave;
	}
}
