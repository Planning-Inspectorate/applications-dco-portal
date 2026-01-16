import type { NsipProject, NsipServiceUser } from '@pins/dco-portal-database/src/client/client.ts';
import type { Prisma } from '@pins/dco-portal-database/src/client/client.ts';

export function mapNsipProjectToCase(nsipProject: NsipProject | null) {
	return {
		projectDescription: nsipProject?.projectDescription || null,
		locationDescription: nsipProject?.projectLocation || null,
		...(nsipProject?.easting && nsipProject?.northing
			? {
					ProjectSingleSite: {
						create: {
							easting: nsipProject.easting,
							northing: nsipProject.northing
						}
					}
				}
			: {})
	};
}

export function mapNsipServiceUserToCase(nsipServiceUser: NsipServiceUser | null): Partial<Prisma.CaseCreateInput> {
	return {
		...(nsipServiceUser !== null
			? {
					ApplicantDetails: {
						create: {
							firstName: nsipServiceUser.firstName || '',
							lastName: nsipServiceUser.lastName || '',
							emailAddress: nsipServiceUser.email || '',
							phone: nsipServiceUser.telephoneNumber || '',
							organisation: nsipServiceUser.organisation || '',
							Address: {
								create: {
									addressLine1: nsipServiceUser.addressLine1 || '',
									addressLine2: nsipServiceUser.addressLine2 || '',
									townCity: nsipServiceUser.addressTown || '',
									county: nsipServiceUser.addressCounty || '',
									country: nsipServiceUser.addressCountry || '',
									postcode: nsipServiceUser.postcode || ''
								}
							}
						}
					}
				}
			: {})
	};
}
