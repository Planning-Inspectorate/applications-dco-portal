export interface ContactDetailsRecord {
	firstName: string;
	lastName: string;
	emailAddress: string;
	phoneNumber: string;
	organisation: string;
	paymentReference: string;
	PaymentMethod: PaymentMethodCreateNestedOneWithoutContactDetailsInput;
}
