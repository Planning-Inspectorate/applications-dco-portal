export interface ContactDetailsRecord {
	firstName: string;
	lastName: string;
	emailAddress: string;
	phone: string;
	organisation: string;
}

export interface FullAddressRecord {
	addressLine1: string;
	addressLine2: string;
	townCity: string;
	county: string | null;
	country: string;
	postcode: string;
}

export type ApplicantAgentDetailsPrefix = 'applicant' | 'agent';

export type PaymentMethodWithHint = { id: string; displayName: string; hint: { text: string } };
