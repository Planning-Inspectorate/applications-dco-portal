import type { NotifyConfig } from '@pins/dco-portal-lib/govnotify/types.d.ts';

interface Config {
	appHostname: string;
	database: {
		connectionString: string;
	};
	govNotify: NotifyConfig;
	logLevel: string;
	NODE_ENV: string;
	serviceBus: {
		subscriptions: {
			nsipProject: string;
			serviceUser: string;
		};
		topics: {
			nsipProject: string;
			serviceUser: string;
		};
	};
}
