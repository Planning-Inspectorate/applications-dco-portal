import { body } from 'express-validator';
import BaseValidator from '@planning-inspectorate/dynamic-forms/src/validator/base-validator.js';

const validatePostcode = (postcode, errorMessage = 'Enter a valid postcode') => {
	const pattern =
		/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
	const result = pattern.exec(postcode);
	if (!result) {
		throw new Error(errorMessage);
	}
	return postcode;
};

export const buildingNameOrNumberMaxLength = 250;
export const buildingNameOrNumberMinLength = 0;
export const streetMaxLength = 250;
export const streetMinLength = 0;
export const townCityMaxLength = 250;
export const townCityMinLength = 0;
export const countyMaxLength = 250;
export const countyMinLength = 0;
export const countryMaxLength = 250;
export const countryMinLength = 0;
export const postcodeMaxLength = 10;
export const postcodeMinLength = 1;

/**
 * enforces address fields are within allowed parameters
 * @class
 */
export default class FullAddressValidator extends BaseValidator {
	/**
	 * creates an instance of a FullAddressValidator
	 * @param {Object} opts
	 * @param {boolean} [opts.required]
	 * @param {{[key: string]: boolean}} [opts.requiredFields]
	 */
	constructor(opts) {
		super();
		this.requiredFields = opts?.requiredFields;
	}

	/**
	 * validates response body using questionObj fieldname
	 * @param {Question} questionObj
	 */
	validate(questionObj) {
		const fieldName = questionObj.fieldName;

		return [
			this.#buildingNameOrNumberRule(fieldName),
			this.#streetRule(fieldName),
			this.#townCityRule(fieldName),
			this.#countyRule(fieldName),
			this.#countryRule(fieldName),
			this.#postCodeRule(fieldName)
		];
	}

	/**
	 * a validation chain for buildingNameOrNumber
	 * @param {string} fieldName
	 */
	#buildingNameOrNumberRule(fieldName) {
		const validator = body(fieldName + '_buildingNameOrNumber');

		if (!this.requiredFields?.buildingNameOrNumber) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a building name or number`);
		}

		return validator
			.isLength({ min: buildingNameOrNumberMinLength, max: buildingNameOrNumberMaxLength })
			.bail()
			.withMessage(`Building name or number must be ${buildingNameOrNumberMaxLength} characters or less`);
	}

	/**
	 * a validation chain for street
	 * @param {string} fieldName
	 */
	#streetRule(fieldName) {
		const validator = body(fieldName + '_street');
		if (!this.requiredFields?.street) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a street`);
		}

		return validator
			.isLength({ min: streetMinLength, max: streetMaxLength })
			.bail()
			.withMessage(`Street must be ${streetMaxLength} characters or less`);
	}

	/**
	 * a validation chain for townCity
	 * @param {string} fieldName
	 */
	#townCityRule(fieldName) {
		const validator = body(fieldName + '_townCity');
		if (!this.requiredFields?.townCity) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a town or city`);
		}
		return validator
			.isLength({ min: townCityMinLength, max: townCityMaxLength })
			.bail()
			.withMessage(`Town or city must be ${townCityMaxLength} characters or less`);
	}

	/**
	 * a validation chain for county
	 * @param {string} fieldName
	 */
	#countyRule(fieldName) {
		const validator = body(fieldName + '_county');
		if (!this.requiredFields?.county) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a county`);
		}

		return validator
			.isLength({ min: countyMinLength, max: countyMaxLength })
			.bail()
			.withMessage(`County must be ${countyMaxLength} characters or less`);
	}

	/**
	 * a validation chain for country
	 * @param {string} fieldName
	 */
	#countryRule(fieldName) {
		const validator = body(fieldName + '_country');
		if (!this.requiredFields?.country) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a country`);
		}

		return validator
			.isLength({ min: countryMinLength, max: countryMaxLength })
			.bail()
			.withMessage(`County must be ${countryMaxLength} characters or less`);
	}

	/**
	 * a validation chain for postcode
	 * @param {string} fieldName
	 */
	#postCodeRule(fieldName) {
		const validator = body(fieldName + '_postcode');
		if (!this.requiredFields?.postcode) {
			validator.optional({ checkFalsy: true });
		} else {
			validator.notEmpty().withMessage(`Enter a postcode`);
		}

		return validator
			.isLength({ min: postcodeMinLength, max: postcodeMaxLength })
			.bail()
			.withMessage(`Postcode must be between ${postcodeMinLength} and ${postcodeMaxLength} characters`)
			.custom((postcode) => {
				return validatePostcode(postcode);
			});
	}

	isRequired() {
		if (this.requiredFields) {
			return Object.values(this.requiredFields).some((field) => Boolean(field));
		}
		return false;
	}
}
