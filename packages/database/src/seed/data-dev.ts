import type { PrismaClient } from '@pins/dco-portal-database/src/client';

export async function seedDev(dbClient: PrismaClient) {
	const CASE_WHITELIST = process.env.CASE_WHITELIST;
	if (CASE_WHITELIST) {
		await Promise.all(
			CASE_WHITELIST.split(',').map((entry) => {
				const [caseReference, email] = entry.split(':');
				if (caseReference && email) {
					const normalisedEmail = email.toLowerCase();
					const serviceUserUpdate = {
						id: crypto.randomUUID(),
						caseReference,
						serviceUserType: 'Applicant',
						email: normalisedEmail
					};
					return dbClient.nsipServiceUser.upsert({
						where: {
							caseReference_email: {
								caseReference,
								email: normalisedEmail
							}
						},
						update: serviceUserUpdate,
						create: serviceUserUpdate
					});
				}
			})
		);
	}

	console.log('dev seed complete');
}
