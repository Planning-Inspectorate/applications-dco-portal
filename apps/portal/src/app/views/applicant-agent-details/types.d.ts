export interface ContactDetailsRecord {
	firstName: string;
	lastName: string;
	emailAddress: string;
	phone: string;
	fax: string;
	organisation: string;
	paymentReference: string;
	PaymentMethod: PaymentMethodCreateNestedOneWithoutContactDetailsInput;
}

export interface FullAddressRecord {
	addressLine1: string;
	addressLine2: string;
	townCity: string;
	county: string;
	country: string;
	postcode: string;
}
