import { initDatabaseClient } from '@pins/dco-portal-database';
import { initGovNotify } from '@pins/dco-portal-lib/govnotify/index.ts';
import type { Config } from './config-types.d.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import type { GovNotifyClient } from '@pins/dco-portal-lib/govnotify/gov-notify-client.ts';
import type { BlobStorageClient } from '@pins/dco-portal-lib/blob-store/blob-store-client.ts';
import { initBlobStore } from '@pins/dco-portal-lib/blob-store/index.ts';
import type { ServiceBusEventClient } from '@pins/dco-portal-lib/event/service-bus-event-client.ts';
import { initEventClient } from '@pins/dco-portal-lib/event/index.ts';
import { initPdfService } from '@pins/dco-portal-lib/pdf-service/index.ts';
import type { PdfServiceClient } from '@pins/dco-portal-lib/pdf-service/pdf-service-client.ts';

import { EventEmitter } from 'events';
import { bindPdfEvents } from './events/pdf/events.ts';
import { BaseService } from '@planning-inspectorate/core';

/**
 * This class encapsulates all the services and clients for the application
 */
export class PortalService extends BaseService<PrismaClient> {
	#config: Config;
	#eventEmitter: EventEmitter;
	notifyClient: GovNotifyClient | null;
	blobStoreClient: BlobStorageClient | null;
	serviceBusEventClient: ServiceBusEventClient | null;
	pdfServiceClient: PdfServiceClient | null;

	constructor(config: Config) {
		super(config, initDatabaseClient);

		this.#config = config;
		this.#eventEmitter = new EventEmitter();
		this.notifyClient = initGovNotify(config.govNotify, this.logger);
		this.blobStoreClient = initBlobStore(config.blobStore, this.logger);
		this.serviceBusEventClient = initEventClient(config.serviceBus, this.logger);
		this.pdfServiceClient = initPdfService(config.pdf, this.logger);

		this.bindEventListeners();
	}

	get appHostname() {
		return this.#config.appHostname;
	}

	get eventEmitter() {
		return this.#eventEmitter;
	}

	get blobStore() {
		return this.blobStoreClient;
	}

	get isApplicationEnabled() {
		return this.#config.isApplicationEnabled;
	}

	get nodeEnv() {
		return this.#config.NODE_ENV;
	}

	get enableE2eTestEndpoints() {
		return this.#config.enableE2eTestEndpoints;
	}

	get otherSessionOptions() {
		return {
			maxAge: 30 * 60 * 1000, // 30 minutes
			rolling: true
		};
	}

	get fullRedisClient() {
		return this.redisClient?.fullClient;
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
