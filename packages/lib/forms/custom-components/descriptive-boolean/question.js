import { BooleanQuestion } from '@planning-inspectorate/dynamic-forms';

export default class DescriptiveBooleanQuestion extends BooleanQuestion {
	constructor({ title, question, fieldName, url, hint, pageTitle, description, html, options, validators, editable }) {
		super({
			title,
			question,
			fieldName,
			url,
			hint,
			pageTitle,
			description,
			options,
			validators,
			html,
			editable
		});
		this.viewFolder = 'custom-components/descriptive-boolean';
	}
}
