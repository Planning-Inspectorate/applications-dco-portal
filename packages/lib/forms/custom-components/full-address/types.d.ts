import { CommonQuestionProps } from '@planning-inspectorate/dynamic-forms/src/questions/question-props.js';

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

export interface FullAddressProps extends CommonQuestionProps {
	type: 'full-address';
	fieldLabels: {
		addressLine1?: string;
		addressLine2?: string;
		townCity?: string;
		county?: string;
		country?: string;
		postcode?: string;
	};
	validatorOptions?: AddressValidatorOpts;
}
