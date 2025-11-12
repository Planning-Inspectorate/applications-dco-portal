import { Question } from '@planning-inspectorate/dynamic-forms/src/questions/question.js';
import { nl2br } from '@planning-inspectorate/dynamic-forms/src/lib/utils.js';
import escape from 'escape-html';
import { FullAddress } from './full-address.ts';
import FullAddressValidator from './full-address-validator.ts';

/**
 * @typedef {import('../../journey/journey-response.js').JourneyResponse} JourneyResponse
 * @typedef {import('../../journey/journey.js').Journey} Journey
 * @typedef {import('../../section.js').Section} Section
 * @typedef {import('../../questions/question.js').QuestionViewModel} QuestionViewModel
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress

 */
export default class FullAddressQuestion extends Question {
	/**
	 * @param {import('#question-types').QuestionParameters} params
	 */
	constructor(params) {
		super({
			...params,
			viewFolder: 'custom-components/full-address'
		});

		for (const validator of params.validators || []) {
			if (validator instanceof FullAddressValidator) {
				this.requiredFields = validator.requiredFields;
			}
		}

		this.addressLabels = {
			addressLine1: `${params.fieldLabels?.addressLine1 || 'Address line 1'}${this.formatLabelFromRequiredFields('addressLine1')}`,
			addressLine2: `${params.fieldLabels?.addressLine2 || 'Address line 2'}${this.formatLabelFromRequiredFields('addressLine2')}`,
			townCity: `${params.fieldLabels?.townCity || 'Town or city'}${this.formatLabelFromRequiredFields('townCity')}`,
			county: `${params.fieldLabels?.county || 'County'}${this.formatLabelFromRequiredFields('county')}`,
			country: `${params.fieldLabels?.country || 'Country'}${this.formatLabelFromRequiredFields('country')}`,
			postcode: `${params.fieldLabels?.postcode || 'Postcode'}${this.formatLabelFromRequiredFields('postcode')}`
		};
	}

	/**
	 * overrides superclass method because this one uses payload to preserve your inputs after failed validation
	 * @param {Section} section
	 * @param {Journey} journey
	 * @param {Record<string, unknown>} customViewData
	 * @returns {QuestionViewModel}
	 */
	prepQuestionForRendering(section, journey, customViewData, payload) {
		const viewModel = super.prepQuestionForRendering(section, journey, customViewData);
		const address = this.formatPayload(payload) || viewModel.question.value;

		if (address) {
			viewModel.question.value = {
				addressLine1: address.addressLine1 || '',
				addressLine2: address.addressLine2 || '',
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
		const address = this.formatPayload(req.body);
		const answers = {
			[this.fieldName]: address
		};
		journeyResponse.answers[this.fieldName] = address;

		return {
			answers
		};
	}

	/**
	 * formats the raw payload full address data into fields that can be processed by the db or viewmodel
	 * @param {Object<any> | undefined} payload
	 * @returns {FullAddress | null}
	 */
	formatPayload(_payload) {
		const payload = _payload || {};
		const data = {
			addressLine1: payload[this.fieldName + '_addressLine1'],
			addressLine2: payload[this.fieldName + '_addressLine2'],
			townCity: payload[this.fieldName + '_townCity'],
			county: payload[this.fieldName + '_county'],
			country: payload[this.fieldName + '_country'],
			postcode: payload[this.fieldName + '_postcode']
		};
		const allEmpty = Object.values(data).every((v) => !v);
		return !allEmpty ? new FullAddress(data) : null;
	}

	/**
	 * @param {Object<string, any>} answer
	 * @returns The formatted address to be presented in the UI
	 */
	format(answer) {
		const addressComponents = [
			answer.addressLine1,
			answer.addressLine2,
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
