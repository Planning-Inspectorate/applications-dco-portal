import { initDatabaseClient } from '@pins/dco-portal-database';
import { initGovNotify } from '@pins/dco-portal-lib/govnotify/index.ts';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';
import { initRedis } from '@pins/dco-portal-lib/redis/index.ts';
import type { Config } from './config-types.d.ts';
import type { Logger } from 'pino';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import { RedisClient } from '@pins/dco-portal-lib/redis/redis-client.ts';
import { GovNotifyClient } from '@pins/dco-portal-lib/govnotify/gov-notify-client.ts';
import { BlobStorageClient } from '@pins/dco-portal-lib/blob-store/blob-store-client.ts';
import { initBlobStore } from '@pins/dco-portal-lib/blob-store/index.ts';

/**
 * This class encapsulates all the services and clients for the application
 */
export class PortalService {
	#config: Config;
	logger: Logger;
	dbClient: PrismaClient;
	redisClient: RedisClient | null;
	notifyClient: GovNotifyClient | null;
	blobStoreClient: BlobStorageClient | null;

	constructor(config: Config) {
		this.#config = config;
		const logger = initLogger(config);
		this.logger = logger;
		this.dbClient = initDatabaseClient(config, logger);
		this.redisClient = initRedis(config.session, logger);
		this.notifyClient = initGovNotify(config.govNotify, logger);
		this.blobStoreClient = initBlobStore(config.blobStore, logger);
	}

	get cacheControl() {
		return this.#config.cacheControl;
	}

	get blobStore() {
		return this.blobStoreClient;
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

	get enableTestTools() {
		return this.#config.enableTestTools;
	}
}
