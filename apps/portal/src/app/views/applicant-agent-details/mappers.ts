import type { ContactDetailsRecord, FullAddressRecord } from './types.js';

export function mapAnswersToContact(answers: Record<string, any>, prefix: string): ContactDetailsRecord {
	return {
		firstName: answers[`${prefix}FirstName`],
		lastName: answers[`${prefix}LastName`],
		emailAddress: answers[`${prefix}EmailAddress`],
		phone: answers[`${prefix}Phone`],
		organisation: answers[`${prefix}Organisation`]
	};
}

export function mapAnswersToFullAddressInput(addressAnswer: Record<string, any>): FullAddressRecord {
	return {
		addressLine1: addressAnswer.addressLine1,
		addressLine2: addressAnswer.addressLine2,
		townCity: addressAnswer.townCity,
		county: addressAnswer.county || null,
		country: addressAnswer.country,
		postcode: addressAnswer.postcode
	};
}
