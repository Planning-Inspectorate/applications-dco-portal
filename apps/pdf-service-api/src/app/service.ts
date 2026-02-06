import type { Config } from './config-types.d.ts';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';
import type { Logger } from 'pino';

/**
 * This class encapsulates all the services and clients for the application
 */
export class PdfService {
	#config: Config;
	logger: Logger;

	constructor(config: Config) {
		this.#config = config;
		const logger = initLogger(config);
		this.logger = logger;
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

	get fileUpload() {
		return this.#config.fileUpload;
	}
}
