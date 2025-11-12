export interface ContactDetailsRecord {
	firstName: string;
	lastName: string;
	organisation: string;
	paymentReference: string;
	PaymentMethod: PaymentMethodCreateNestedOneWithoutContactDetailsInput;
}
