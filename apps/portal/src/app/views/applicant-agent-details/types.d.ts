export interface ContactDetailsRecord {
	organisation: string;
	paymentReference: string;
	PaymentMethod: PaymentMethodCreateNestedOneWithoutContactDetailsInput;
}
