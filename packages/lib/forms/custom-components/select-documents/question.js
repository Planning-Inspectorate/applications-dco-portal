import CheckboxQuestion from '@planning-inspectorate/dynamic-forms/src/components/checkbox/question.js';

export default class SelectDocuments extends CheckboxQuestion {
	constructor({ ...params }) {
		super({
			...params
		});
		this.viewFolder = 'custom-components/select-documents';
		this.html = params.html;
		this.options = [];
		this.hint = params.hint;
		// used to conditionally allow the user to submit with no uploaded documents if the question is not required
		this.required = params.validators.some((validator) => validator.constructor.name === 'RequiredValidator');
	}

	prepQuestionForRendering(section, journey, customViewData) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		viewModel.question.required = this.required;
		return viewModel;
	}

	setOptions(options) {
		this.options = options;
	}
}
