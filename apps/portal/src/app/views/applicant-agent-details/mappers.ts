import type { ContactDetailsRecord, FullAddressRecord } from './types.js';

export function mapAnswersToInput(answers: Record<string, any>): ContactDetailsRecord {
	return {
		firstName: answers.firstName,
		lastName: answers.lastName,
		emailAddress: answers.emailAddress,
		phone: answers.phone,
		fax: answers.fax,
		organisation: answers.organisation,
		paymentReference: answers.paymentReference,
		PaymentMethod: {
			connect: {
				id: answers.paymentMethod
			}
		}
	};
}

export function mapAnswersToFullAddressInput(answers: Record<string, any>): FullAddressRecord {
	return {
		addressLine1: answers.addressLine1,
		addressLine2: answers.addressLine2,
		townCity: answers.townCity,
		county: answers.county,
		country: answers.country,
		postcode: answers.postcode
	};
}
