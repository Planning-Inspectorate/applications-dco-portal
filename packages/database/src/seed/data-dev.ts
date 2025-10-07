import type { PrismaClient } from '@pins/dco-portal-database/src/client';

export async function seedDev(dbClient: PrismaClient) {
	// TODO: add seed data
	await dbClient.$queryRaw`SELECT 1`;

	console.log('dev seed complete');
}
