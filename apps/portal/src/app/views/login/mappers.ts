import type { NsipProject, NsipServiceUser } from '@pins/dco-portal-database/src/client/client.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
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

type CaseWithWhitelist = Prisma.CaseGetPayload<{
	include: {
		Whitelist: true;
	};
}>;

/**
 * used to determine if a question label in a certain section of the form (denoted by the key) was prepopulated by cbos
 */
export function mapNsipToQuestionWasPrepopulated(
	nsipProject: NsipProject | null,
	nsipServiceUser: NsipServiceUser | null,
	caseData: CaseWithWhitelist
): Record<string, boolean> {
	const aboutTheProjectNotStarted =
		(caseData as any)[`aboutTheProjectStatusId`] === DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED;
	const applicantAgentDetailsNotStarted =
		(caseData as any)[`applicantAndAgentDetailsStatusId`] === DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED;

	return {
		description: !!nsipProject?.projectDescription && aboutTheProjectNotStarted,
		locationDescription: !!nsipProject?.projectLocation && aboutTheProjectNotStarted,
		singleGridReferences: !!(nsipProject?.easting || nsipProject?.northing) && aboutTheProjectNotStarted,
		applicantOrganisation: !!nsipServiceUser?.organisation && applicantAgentDetailsNotStarted,
		applicantName: !!(nsipServiceUser?.firstName || nsipServiceUser?.lastName) && applicantAgentDetailsNotStarted,
		applicantEmailAddress: !!nsipServiceUser?.email && applicantAgentDetailsNotStarted,
		applicantPhone: !!nsipServiceUser?.telephoneNumber && applicantAgentDetailsNotStarted,
		applicantAddress:
			!!(
				nsipServiceUser?.addressLine1 ||
				nsipServiceUser?.addressLine2 ||
				nsipServiceUser?.addressTown ||
				nsipServiceUser?.addressCounty ||
				nsipServiceUser?.addressCountry
			) && applicantAgentDetailsNotStarted
	};
}
