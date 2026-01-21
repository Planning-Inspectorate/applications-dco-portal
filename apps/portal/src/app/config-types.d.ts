import { NotifyConfig, ServiceBusConfig } from '@pins/dco-portal-lib/govnotify/types';
import { BlobStoreConfig } from '@pins/dco-portal-lib/blob-store/types';
import { PdfServiceConfig } from '@pins/dco-portal-lib/pdf-service/types.js';

interface Config {
	appHostname?: string;
	blobStore: BlobStoreConfig;
	pdf: PdfServiceConfig;
	cacheControl: {
		maxAge: string;
	};
	database: {
		datasourceUrl: string;
	};
	gitSha?: string;
	govNotify: NotifyConfig;
	httpPort: number;
	logLevel: string;
	NODE_ENV: string;
	serviceBus: ServiceBusConfig;
	session: {
		redisPrefix: string;
		redis?: string;
		secret: string;
	};
	srcDir: string;
	staticDir: string;
	enableE2eTestEndpoints: boolean;
	testToolsToken?: string;
}
