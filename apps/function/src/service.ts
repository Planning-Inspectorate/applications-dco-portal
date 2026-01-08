import { initDatabaseClient } from '@pins/dco-portal-database';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import type { Config } from './config-types.d.ts';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';
import type { Logger } from 'pino';
import { GovNotifyClient } from '@pins/dco-portal-lib/govnotify/gov-notify-client.ts';
import { initGovNotify } from '@pins/dco-portal-lib/govnotify/index.ts';

/**
 * This class encapsulates all the services and clients for the application
 */
export class FunctionService {
	#config: Config;
	logger: Logger;
	dbClient: PrismaClient;
	notifyClient: GovNotifyClient | null;

	constructor(config: Config) {
		this.#config = config;

		const logger = initLogger(config);
		this.logger = logger;

		if (!config.database.datasourceUrl) {
			throw new Error('database connectionString is required');
		}
		this.dbClient = initDatabaseClient(config, logger);
		this.notifyClient = initGovNotify(config.govNotify, logger);
	}

	/**
	 * Alias of dbClient
	 *
	 * @returns {import('@pins/dco-portal-database/src/client').PrismaClient}
	 */
	get db() {
		return this.dbClient;
	}

	get serviceBusConfig() {
		return this.#config.serviceBus;
	}
}
