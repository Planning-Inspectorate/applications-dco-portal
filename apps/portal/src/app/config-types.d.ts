import { NotifyConfig } from '@pins/dco-portal-lib/govnotify/types';
import { BlobStoreConfig } from '@pins/dco-portal-lib/blob-store/types';

interface Config {
	appHostname?: string;
	blobStore: BlobStoreConfig;
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
	srcDir: string;
	session: {
		redisPrefix: string;
		redis?: string;
		secret: string;
	};
	staticDir: string;
	enableE2eTestEndpoints: boolean;
	testToolsToken?: string;
}
