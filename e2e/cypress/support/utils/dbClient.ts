// cypress/support/dbClient.ts
import { initDatabaseClient } from '@pins/dco-portal-database';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';

const logger = initLogger({ logLevel: 'info', NODE_ENV: 'test' });

export const prisma = initDatabaseClient(
	{
		database: { datasourceUrl: 'test' },
		NODE_ENV: 'test'
	},
	logger
);
