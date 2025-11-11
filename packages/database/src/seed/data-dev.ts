import type { PrismaClient } from '@pins/dco-portal-database/src/client';

export async function seedDev(dbClient: PrismaClient) {
	const CASE_WHITELIST = process.env.CASE_WHITELIST;
	if (CASE_WHITELIST) {
		CASE_WHITELIST.split(',').forEach((entry) => {
			const [caseReference, email] = entry.split(':');
			if (caseReference && email) {
				const serviceUserUpdate = {
					id: crypto.randomUUID(),
					caseReference,
					serviceUserType: 'Applicant',
					email
				};
				dbClient.nsipServiceUser.upsert({
					where: {
						id: serviceUserUpdate.id,
						caseReference,
						serviceUserType: serviceUserUpdate.serviceUserType
					},
					update: serviceUserUpdate,
					create: serviceUserUpdate
				});
			}
		});
	}

	console.log('dev seed complete');
}
