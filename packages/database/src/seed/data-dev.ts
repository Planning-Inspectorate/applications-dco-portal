import type { PrismaClient } from '@pins/dco-portal-database/src/client';
import { v4 as uuidv4 } from 'uuid';

export async function seedDev(dbClient: PrismaClient) {
	const CASE_WHITELIST = process.env.CASE_WHITELIST;
	if (CASE_WHITELIST) {
		CASE_WHITELIST.split(',').forEach((entry) => {
			const [caseReference, email] = entry.split(':');
			if (caseReference && email) {
				const serviceUserUpdate = {
					id: uuidv4(),
					caseReference,
					serviceUserType: 'Applicant',
					email
				};
				dbClient.nsipServiceUser.upsert({
					where: { caseReference },
					update: serviceUserUpdate,
					create: serviceUserUpdate
				});
			}
		});
	}

	console.log('dev seed complete');
}
