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
import { ServiceBusEventClient } from '@pins/dco-portal-lib/event/service-bus-event-client.ts';
import { initEventClient } from '@pins/dco-portal-lib/event/index.ts';
import { initPdfService } from '@pins/dco-portal-lib/pdf-service/index.ts';
import { PdfServiceClient } from '@pins/dco-portal-lib/pdf-service/pdf-service-client.ts';

import { EventEmitter } from 'events';
import { bindPdfEvents } from './events/pdf/events.ts';

/**
 * This class encapsulates all the services and clients for the application
 */
export class PortalService {
	#config: Config;
	#eventEmitter: EventEmitter;
	logger: Logger;
	dbClient: PrismaClient;
	redisClient: RedisClient | null;
	notifyClient: GovNotifyClient | null;
	blobStoreClient: BlobStorageClient | null;
	serviceBusEventClient: ServiceBusEventClient | null;
	pdfServiceClient: PdfServiceClient | null;

	constructor(config: Config) {
		this.#config = config;
		this.#eventEmitter = new EventEmitter();
		const logger = initLogger(config);
		this.logger = logger;
		this.dbClient = initDatabaseClient(config, logger);
		this.redisClient = initRedis(config.session, logger);
		this.notifyClient = initGovNotify(config.govNotify, logger);
		this.blobStoreClient = initBlobStore(config.blobStore, logger);
		this.serviceBusEventClient = initEventClient(config.serviceBus, logger);
		this.pdfServiceClient = initPdfService(config.pdf, logger);

		this.bindEventListeners();
	}

	get cacheControl() {
		return this.#config.cacheControl;
	}

	get eventEmitter() {
		return this.#eventEmitter;
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

	get nodeEnv() {
		return this.#config.NODE_ENV;
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

	get enableE2eTestEndpoints() {
		return this.#config.enableE2eTestEndpoints;
	}

	get testToolsToken() {
		return this.#config.testToolsToken;
	}

	private bindEventListeners(): void {
		const emitter = this.#eventEmitter;

		bindPdfEvents(this);

		emitter.on('error', (err: Error) => {
			this.logger.error(err, 'EventEmitter error');
		});
	}
}
