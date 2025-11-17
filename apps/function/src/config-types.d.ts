import { Prisma } from 'prisma-client-7d10cd48d02ddf4d5115dfbb37c628c5ad928a65742380d8d9524e8b387b93d1';

interface Config {
	database: Prisma.PrismaClientOptions;
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
