import { Prisma } from '@pins/dco-portal-database/src/client';
import { NotifyConfig } from '@pins/dco-portal-lib/govnotify/types';

interface Config {
	appHostname?: string;
	cacheControl: {
		maxAge: string;
	};
	database: Prisma.PrismaClientOptions;
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
}
