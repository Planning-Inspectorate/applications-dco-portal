import { body } from 'express-validator';
import BaseValidator from '@planning-inspectorate/dynamic-forms/src/validator/base-validator.js';
// @ts-expect-error - due to not having @types
import OptionsQuestion from '@planning-inspectorate/dynamic-forms/src/questions/options-question.js';

export default class RequiredAnswerValidator extends BaseValidator {
	emptyAnswerErrorMessage: string;
	requiredAnswerErrorMessage: string;
	requiredAnswers: string[];

	constructor(opts: {
		emptyAnswerErrorMessage?: string;
		requiredAnswerErrorMessage?: string;
		requiredAnswers: string[];
	}) {
		super();

		if (!opts.requiredAnswers) throw new Error('Required answers validator needs required answers');
		this.requiredAnswers = opts.requiredAnswers;

		if (opts.emptyAnswerErrorMessage) {
			this.emptyAnswerErrorMessage = opts.emptyAnswerErrorMessage;
		} else {
			this.emptyAnswerErrorMessage = 'You must select an answer';
		}

		if (opts.requiredAnswerErrorMessage) {
			this.requiredAnswerErrorMessage = opts.requiredAnswerErrorMessage;
		} else {
			this.requiredAnswerErrorMessage = 'You must select a valid answer';
		}
	}

	validate(questionObj: OptionsQuestion) {
		return body(questionObj.fieldName)
			.notEmpty()
			.withMessage(this.emptyAnswerErrorMessage)
			.custom((value) => {
				if (Array.isArray(value)) {
					return this.requiredAnswers.every((required) => value.includes(required));
				} else {
					return value === this.requiredAnswers[0];
				}
			})
			.withMessage(this.requiredAnswerErrorMessage);
	}
}
