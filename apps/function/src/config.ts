import dotenv from 'dotenv';
import type { Config } from './config-types.d.ts';

export function loadConfig(): Config {
	dotenv.config();

	const {
		LOG_LEVEL,
		NODE_ENV,
		NSIP_PROJECT_SUBSCRIPTION,
		NSIP_PROJECT_TOPIC,
		SERVICE_USER_SUBSCRIPTION,
		SERVICE_USER_TOPIC,
		SQL_CONNECTION_STRING,
		GOV_NOTIFY_DISABLED,
		GOV_NOTIFY_API_KEY,
		GOV_NOTIFY_ANTI_VIRUS_FAILED_TEMPLATE_ID
	} = process.env;

	const props = {
		NSIP_PROJECT_SUBSCRIPTION,
		NSIP_PROJECT_TOPIC,
		SERVICE_USER_SUBSCRIPTION,
		SERVICE_USER_TOPIC,
		SQL_CONNECTION_STRING,
		GOV_NOTIFY_DISABLED,
		GOV_NOTIFY_API_KEY,
		GOV_NOTIFY_ANTI_VIRUS_FAILED_TEMPLATE_ID
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
		govNotify: {
			disabled: GOV_NOTIFY_DISABLED === 'true',
			apiKey: GOV_NOTIFY_API_KEY || '',
			templateIds: {
				antiVirusFailedNotification: GOV_NOTIFY_ANTI_VIRUS_FAILED_TEMPLATE_ID
			}
		},
		logLevel: LOG_LEVEL || 'info',
		NODE_ENV: NODE_ENV || 'development',
		serviceBus: {
			subscriptions: {
				nsipProject: NSIP_PROJECT_SUBSCRIPTION || '',
				serviceUser: SERVICE_USER_SUBSCRIPTION || ''
			},
			topics: {
				nsipProject: NSIP_PROJECT_TOPIC || '',
				serviceUser: SERVICE_USER_TOPIC || ''
			}
		}
	};
}
