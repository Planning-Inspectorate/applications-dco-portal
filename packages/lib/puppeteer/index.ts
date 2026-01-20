import type { Logger } from 'pino';
import { PuppeteerClient } from './puppeteer-client.ts';
import type { PuppeteerConfig } from './types.d.ts';

export function initPuppeteer(config: PuppeteerConfig, logger: Logger) {
	if (!config.host) {
		return null;
	}

	if (!config.container) {
		return null;
	}

	return new PuppeteerClient(logger, config.host, config.container);
}
