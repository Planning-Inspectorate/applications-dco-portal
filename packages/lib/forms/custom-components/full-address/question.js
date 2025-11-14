import { Question } from '@planning-inspectorate/dynamic-forms/src/questions/question.js';
import { nl2br } from '@planning-inspectorate/dynamic-forms/src/lib/utils.js';
import escape from 'escape-html';
import { Address } from '@planning-inspectorate/dynamic-forms/src/lib/address.js';

/**
 * @typedef {import('../../journey/journey-response.js').JourneyResponse} JourneyResponse
 * @typedef {import('../../journey/journey.js').Journey} Journey
 * @typedef {import('../../section.js').Section} Section
 * @typedef {import('../../questions/question.js').QuestionViewModel} QuestionViewModel
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress

 */

//TODO: make index.njk template
export default class FullAddressQuestion extends Question {
	/**
	 * @param {import('#question-types').QuestionParameters} params
	 */
	constructor(params) {
		super({
			...params,
			viewFolder: 'custom-components/full-address'
		});

		/*
		for (const validator of params.validators || []) {
			if (validator instanceof FullAddressValidator) {
				this.requiredFields = validator.requiredFields;
			}
		}
            */

		this.addressLabels = {
			buildingNameOrNumber: `Building name or number${this.formatLabelFromRequiredFields('buildingNameOrNumber')}`,
			street: `Street${this.formatLabelFromRequiredFields('street')}`,
			townCity: `Town or city${this.formatLabelFromRequiredFields('townCity')}`,
			county: `County${this.formatLabelFromRequiredFields('county')}`,
			country: `Country${this.formatLabelFromRequiredFields('country')}`,
			postcode: `Postcode${this.formatLabelFromRequiredFields('postcode')}`
		};
	}

	/**
	 * @param {Section} section
	 * @param {Journey} journey
	 * @param {Record<string, unknown>} customViewData
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		const address = journey.response.answers[this.fieldName] || {};

		// will only ever have 1
		if (address) {
			viewModel.question.value = {
				buildingNameOrNumber: address.buildingNameOrNumber || '',
				street: address.street || '',
				townCity: address.townCity || '',
				county: address.county || '',
				country: address.country || '',
				postcode: address.postcode || ''
			};
		}

		viewModel.question.labels = this.addressLabels;

		return viewModel;
	}

	/**
	 * returns the data to send to the DB
	 * side effect: modifies journeyResponse with the new answers
	 * @param {import('express').Request} req
	 * @param {JourneyResponse} journeyResponse
	 * @returns {Promise<{answers: Record<string, unknown>}>}
	 */
	async getDataToSave(req, journeyResponse) {
		const data = {
			buildingNameOrNumber: req.body[this.fieldName + '_buildingNameOrNumber'],
			street: req.body[this.fieldName + '_street'],
			townCity: req.body[this.fieldName + '_townCity'],
			county: req.body[this.fieldName + '_county'],
			country: req.body[this.fieldName + '_country'],
			postcode: req.body[this.fieldName + '_postcode']
		};
		const allEmpty = Object.values(data).every((v) => !v);
		let address = null;
		if (!allEmpty) {
			address = new Address(data);
		}
		const answers = {
			[this.fieldName]: address
		};
		journeyResponse.answers[this.fieldName] = address;

		return {
			answers
		};
	}

	/**
	 * @param {Object<string, any>} answer
	 * @returns The formatted address to be presented in the UI
	 */
	format(answer) {
		const addressComponents = [
			answer.buildingNameOrNumber,
			answer.street,
			answer.townCity,
			answer.county,
			answer.country,
			answer.postcode
		];

		return addressComponents.filter(Boolean).join('\n');
	}

	/**
	 * returns the formatted answers values to be used to build task list elements
	 * @type {Question['formatAnswerForSummary']}
	 */
	formatAnswerForSummary(sectionSegment, journey, answer) {
		let formattedAnswer = this.notStartedText;

		if (answer) {
			formattedAnswer = nl2br(escape(this.format(answer)));
		} else if (answer === null) {
			formattedAnswer = '';
		}

		return [
			{
				key: `${this.title}`,
				value: formattedAnswer,
				action: this.getAction(sectionSegment, journey, answer)
			}
		];
	}
	formatLabelFromRequiredFields(fieldName) {
		if (this.requiredFields && this.requiredFields[fieldName]) {
			return '';
		} else {
			return ' (optional)';
		}
	}
}
