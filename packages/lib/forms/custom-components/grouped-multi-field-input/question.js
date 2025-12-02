import { Question } from '@planning-inspectorate/dynamic-forms/src/questions/question.js';
import { nl2br } from '@planning-inspectorate/dynamic-forms/src/lib/utils.js';
import escape from 'escape-html';

export default class GroupedMultiFieldInputQuestion extends Question {
	/** @type {Record<string, string>} */
	inputAttributes;

	/**
	 * For the validator to work for this component alongside existing dynamic forms logic the fieldName keys must be unique
	 * For this reason the fieldName is not nested inside the group name and is stored irrelevant of the group it belongs to as that adds unnecessary complexity
	 * @param {import('#question-types').QuestionParameters} params
	 * @param {string|undefined} [params.label] if defined this show as a label for the input and the question will just be a standard h1
	 * @param {Record<string, string>} [params.inputAttributes] html attributes to add to the input
	 * @param {InputGroup[]} params.inputGroups the groups of input fields to show
	 */
	constructor({ label, inputAttributes = {}, inputGroups, ...params }) {
		super({
			...params,
			viewFolder: 'custom-components/grouped-multi-field-input'
		});
		this.label = label;
		this.inputAttributes = inputAttributes;

		if (inputGroups) {
			this.inputGroups = inputGroups;
			//required for validating completion of required questions;
			this.inputFields = inputGroups.map((group) => group.fields).flat();
		} else {
			throw new Error('inputGroups are mandatory');
		}
	}

	prepQuestionForRendering(section, journey, customViewData, payload) {
		let viewModel = super.prepQuestionForRendering(section, journey, customViewData);

		const inputGroups = this.inputGroups.map((inputGroup) => {
			return {
				...inputGroup,
				fields: inputGroup.fields.map((inputField) => {
					return payload
						? {
								...inputField,
								value: this.#formatValue(payload[inputField.fieldName], inputField.formatTextFunction)
							}
						: {
								...inputField,
								value: this.#formatValue(journey.response.answers[inputField.fieldName], inputField.formatTextFunction)
							};
				})
			};
		});

		viewModel.question.inputGroups = inputGroups;
		viewModel.question.label = this.label;
		viewModel.question.attributes = this.inputAttributes;
		return viewModel;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse - current journey response, modified with the new answers
	 * @returns {Promise<{ answers: Record<string, unknown> }>}
	 */
	async getDataToSave(req, journeyResponse) {
		/**
		 * @type {{ answers: Record<string, unknown> }}
		 */
		let responseToSave = { answers: {} };

		for (const inputGroup of this.inputGroups) {
			for (const inputField of inputGroup.fields) {
				let value = req.body[inputField.fieldName];
				if (typeof value === 'string') {
					value = value.trim();
				}
				responseToSave.answers[inputField.fieldName] = value;
				journeyResponse.answers[inputField.fieldName] = responseToSave.answers[inputField.fieldName];
			}
		}

		return responseToSave;
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @param {Journey} journey
	 * @param {String} sectionSegment
	 * @returns {Array<{
	 *   key: string;
	 *   value: string | Object;
	 *   action: {
	 *     href: string;
	 *     text: string;
	 *     visuallyHiddenText: string;
	 *   };
	 * }>}
	 */
	formatAnswerForSummary(sectionSegment, journey) {
		const summaryDetails = this.inputGroups.reduce((acc, group) => {
			return (
				acc +
				group.fields.reduce((groupAcc, field) => {
					const answer = this.#formatValue(journey.response.answers[field.fieldName], field.formatTextFunction);
					return answer ? groupAcc + (field.formatPrefix || '') + answer + (field.formatJoinString || '\n') : groupAcc;
				}, '')
			);
		}, '');

		const formattedAnswer = this.#allQuestionsUnanswered(journey) ? this.notStartedText : summaryDetails || '';

		return [
			{
				key: `${this.title}`,
				value: nl2br(escape(formattedAnswer)),
				action: this.getAction(sectionSegment, journey, summaryDetails)
			}
		];
	}

	/**
	 * checks whether any answers have been provided for any input field questions
	 * @param {Journey} journey
	 * @returns {boolean}
	 */
	#allQuestionsUnanswered(journey) {
		const allInputFields = this.inputGroups.reduce((acc, group) => [...acc, ...group.fields], []);
		return allInputFields.every((field) => journey.response.answers[field.fieldName] === undefined);
	}

	/**
	 * returns formatted value/answer if formatting is provided (defaults to value provided)
	 * @param {string} valueToFormat
	 * @param {function} [formatTextFunction]
	 * @returns {string}
	 *
	 */
	#formatValue(valueToFormat, formatTextFunction) {
		if (typeof formatTextFunction === 'function' && valueToFormat) {
			return formatTextFunction(valueToFormat);
		}

		return valueToFormat;
	}
}
