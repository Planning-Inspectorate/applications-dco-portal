/**
 * @file Database client singleton for Cypress database tasks.
 * @module support/utils/dbClient
 *
 * This module creates and shares a Prisma client instance for test cleanup tasks.
 * It connects directly to the SQL database using connection strings from the environment.
 */

import { initDatabaseClient } from '@pins/dco-portal-database';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';

const logger = initLogger({ logLevel: 'info', NODE_ENV: 'test' });

let prisma: ReturnType<typeof initDatabaseClient> | undefined;

/**
 * Resolves the SQL database connection string from environment variables.
 *
 * Checks SQL_CONNECTION_STRING first.
 * Checks SQL_CONNECTION_STRING_ADMIN next.
 * Checks DATABASE_URL last.
 *
 * @returns {string} The resolved connection string.
 * @throws {Error} When no database connection string exists in the environment.
 */
function getDatasourceUrl(): string {
	const url =
		process.env.SQL_CONNECTION_STRING || process.env.SQL_CONNECTION_STRING_ADMIN || process.env.DATABASE_URL || '';

	if (!url || !url.trim()) {
		throw new Error(
			'Missing DB connection string. Set SQL_CONNECTION_STRING (or SQL_CONNECTION_STRING_ADMIN / DATABASE_URL) in e2e/.env'
		);
	}

	return url;
}

/**
 * Returns the singleton Prisma database client instance.
 * Creates the client on the first call.
 *
 * @returns {ReturnType<typeof initDatabaseClient>} The shared database client.
 */
export function getPrisma(): ReturnType<typeof initDatabaseClient> {
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
