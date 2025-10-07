import { GovNotifyClient } from './gov-notify-client.ts';
import type { NotifyConfig } from './types.d.ts';
import type { Logger } from 'pino';

export function initGovNotify(config: NotifyConfig, logger: Logger): GovNotifyClient | null {
	if (config.disabled) {
		return null;
	}

	if (!config.apiKey) {
		return null;
	}

	return new GovNotifyClient(logger, config.apiKey, config.templateIds);
}
