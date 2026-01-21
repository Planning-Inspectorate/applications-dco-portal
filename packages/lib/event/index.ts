import type { Logger } from 'pino';
import { ServiceBusEventClient } from './service-bus-event-client.ts';
import type { ServiceBusConfig } from '../govnotify/types.d.ts';

export function initEventClient(config: ServiceBusConfig, logger: Logger) {
	if (config.disabled) {
		return null;
	}
	return new ServiceBusEventClient(logger, config.hostname);
}
