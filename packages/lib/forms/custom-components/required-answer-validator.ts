import { body } from 'express-validator';
// @ts-expect-error - due to not having @types
import BaseValidator from '@planning-inspectorate/dynamic-forms/src/validator/base-validator.js';
// @ts-expect-error - due to not having @types
import OptionsQuestion from '@planning-inspectorate/dynamic-forms/src/questions/options-question.js';

export default class RequiredAnswerValidator extends BaseValidator {
	errorMessage: string;
	requiredAnswers: string[];

	constructor(opts: { errorMessage?: string; requiredAnswers: string[] }) {
		super();

		if (!opts.requiredAnswers) throw new Error('Required answers validator needs required answers');
		this.requiredAnswers = opts.requiredAnswers;

		if (opts.errorMessage) {
			this.errorMessage = opts.errorMessage;
		} else {
			this.errorMessage = 'You must select a valid answer';
		}
	}

	validate(questionObj: OptionsQuestion) {
		return body(questionObj.fieldName)
			.custom((value) => {
				if (!value) return false;
				if (Array.isArray(value)) {
					return this.requiredAnswers.every((required) => value.includes(required));
				} else {
					return value === this.requiredAnswers[0];
				}
			})
			.withMessage(this.errorMessage);
	}
}
