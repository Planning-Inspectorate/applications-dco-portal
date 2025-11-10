import dotenv from 'dotenv';
import type { Config } from './config-types.d.ts';

export function loadConfig(): Config {
	dotenv.config();

	const { LOG_LEVEL, NODE_ENV, SERVICE_USER_SUBSCRIPTION, SERVICE_USER_TOPIC, SQL_CONNECTION_STRING } = process.env;

	const props = {
		SERVICE_USER_SUBSCRIPTION,
		SERVICE_USER_TOPIC,
		SQL_CONNECTION_STRING
	};

	for (const [k, v] of Object.entries(props)) {
		if (v === undefined || v === '') {
			throw new Error(k + ' must be a non-empty string');
		}
	}

	return {
		database: {
			datasourceUrl: SQL_CONNECTION_STRING
		},
		logLevel: LOG_LEVEL || 'info',
		NODE_ENV: NODE_ENV || 'development',
		serviceBus: {
			subscriptions: {
				serviceUser: SERVICE_USER_SUBSCRIPTION || ''
			},
			topics: {
				serviceUser: SERVICE_USER_TOPIC || ''
			}
		}
	};
}
