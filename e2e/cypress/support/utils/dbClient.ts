// e2e/cypress/support/utils/dbClient.ts
import { initDatabaseClient } from '@pins/dco-portal-database';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';

const logger = initLogger({ logLevel: 'info', NODE_ENV: 'test' });

let prisma: ReturnType<typeof initDatabaseClient> | undefined;

function getDatasourceUrl() {
	// Prefer the normal app connection string, fall back to admin, then DATABASE_URL
	const url =
		process.env.SQL_CONNECTION_STRING || process.env.SQL_CONNECTION_STRING_ADMIN || process.env.DATABASE_URL || '';

	if (!url || !url.trim()) {
		// Fail with a helpful message *when used*, not when Cypress loads config
		throw new Error(
			'Missing DB connection string. Set SQL_CONNECTION_STRING (or SQL_CONNECTION_STRING_ADMIN / DATABASE_URL) in e2e/.env'
		);
	}

	return url;
}

export function getPrisma() {
	if (!prisma) {
		prisma = initDatabaseClient(
			{
				database: {
					datasourceUrl: getDatasourceUrl()
				},
				NODE_ENV: 'test'
			},
			logger
		);
	}

	return prisma;
}
