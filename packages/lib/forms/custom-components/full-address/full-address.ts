import type { FullAddressParams } from './types.d.ts';

export class FullAddress {
	addressLine1: string;
	addressLine2: string;
	townCity: string;
	county?: string;
	country: string;
	postcode: string;

	constructor({ addressLine1, addressLine2, townCity, county, country, postcode }: FullAddressParams) {
		this.addressLine1 = addressLine1?.trim();
		this.addressLine2 = addressLine2?.trim();
		this.townCity = townCity?.trim();
		this.county = county?.trim();
		this.country = country?.trim();
		this.postcode = postcode?.trim();
	}
}
