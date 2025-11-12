export interface FullAddressParams {
	addressLine1: string;
	addressLine2: string;
	townCity: string;
	county?: string;
	country: string;
	postcode: string;
}

export interface AddressValidatorOpts {
	required?: boolean;
	requiredFields?: { [key: string]: boolean };
}
