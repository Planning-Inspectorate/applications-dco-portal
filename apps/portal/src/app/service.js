import { initLogger } from '@pins/dco-portal-lib/util/logger.js';
import { initDatabaseClient } from '@pins/dco-portal-database';
import { initRedis } from '@pins/dco-portal-lib/redis/index.js';
import { initGovNotify } from '@pins/dco-portal-lib/govnotify/index.js';

/**
 * This class encapsulates all the services and clients for the application
 */
export class PortalService {
	/**
	 * @type {import('./config-types.js').BaseConfig}
	 * @private
	 */
	#config;
	/**
	 * @type {import('pino').Logger}
	 */
	logger;
	/**
	 * @type {import('@pins/dco-portal-database/src/client').PrismaClient}
	 */
	dbClient;
	/**
	 * @type {import('../redis/redis-client.js').RedisClient|null}
	 */
	redisClient;
	/**
	 * @type {import('@pins/crowndev-lib/govnotify/gov-notify-client.js').GovNotifyClient|null}
	 */
	notifyClient;

	/**
	 * @param {import('./config-types.js').BaseConfig} config
	 */
	constructor(config) {
		this.#config = config;
		const logger = initLogger(config);
		this.logger = logger;
		this.dbClient = initDatabaseClient(config, logger);
		this.redisClient = initRedis(config.session, logger);
		this.notifyClient = initGovNotify(config.govNotify, logger);
	}

	get cacheControl() {
		return this.#config.cacheControl;
	}

	/**
	 * Alias of dbClient
	 *
	 * @returns {import('@pins/dco-portal-database/src/client').PrismaClient}
	 */
	get db() {
		return this.dbClient;
	}

	get gitSha() {
		return this.#config.gitSha;
	}

	get secureSession() {
		return this.#config.NODE_ENV === 'production';
	}

	get sessionSecret() {
		return this.#config.session.secret;
	}

	get staticDir() {
		return this.#config.staticDir;
	}
}
