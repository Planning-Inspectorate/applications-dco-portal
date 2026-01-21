import dotenv from 'dotenv';
import type { Config } from './config-types.d.ts';

// cache the config
let config: Config | undefined;

export function loadConfig(): Config {
	if (config) {
		return config;
	}
	// load configuration from .env file into process.env
	dotenv.config();

	//get values from environment
	const { GIT_SHA, PORT, LOG_LEVEL, NODE_ENV, FILE_MAX_SIZE_IN_BYTES } = process.env;

	let httpPort = 3000;
	if (PORT) {
		const port = parseInt(PORT);
		if (isNaN(port)) {
			throw new Error('PORT must be an integer');
		}
		httpPort = port;
	}

	config = {
		gitSha: GIT_SHA ?? 'NO GIT SHA FOUND',
		fileUpload: {
			maxSizeInBytes: Number(FILE_MAX_SIZE_IN_BYTES || 1000000)
		},
		logLevel: LOG_LEVEL || 'info',
		NODE_ENV: NODE_ENV || 'development',
		httpPort: httpPort
	};

	return config;
}
