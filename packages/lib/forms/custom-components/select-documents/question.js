import CheckboxQuestion from '@planning-inspectorate/dynamic-forms/src/components/checkbox/question.js';

export default class SelectDocuments extends CheckboxQuestion {
	constructor({ ...params }) {
		super({
			...params
		});
		this.viewFolder = 'custom-components/select-documents';
		this.options = [];
	}

	setOptions(options) {
		this.options = options;
	}
}
