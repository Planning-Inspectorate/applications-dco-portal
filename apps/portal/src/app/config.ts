import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';
import type { Config } from './config-types.d.ts';

// cache the config
let config: Config | undefined;

/**
 * Load configuration from the environment
 */
export function loadConfig(): Config {
	if (config) {
		return config;
	}
	// load configuration from .env file into process.env
	dotenv.config();

	// get values from the environment
	const {
		CACHE_CONTROL_MAX_AGE,
		GIT_SHA,
		LOG_LEVEL,
		PORT,
		NODE_ENV,
		REDIS_CONNECTION_STRING,
		SESSION_SECRET,
		SQL_CONNECTION_STRING,
		GOV_NOTIFY_DISABLED,
		GOV_NOTIFY_API_KEY,
		GOV_NOTIFY_OTP_TEMPLATE_ID,
		BLOB_STORE_DISABLED,
		BLOB_STORE_HOST,
		BLOB_STORE_CONTAINER,
		BLOB_STORE_CONNECTION_STRING,
		ENABLE_E2E_TEST_ENDPOINTS,
		TEST_TOOLS_TOKEN
	} = process.env;

	const buildConfig = loadBuildConfig();

	if (!SESSION_SECRET) {
		throw new Error('SESSION_SECRET is required');
	}

	let httpPort = 8080;
	if (PORT) {
		const port = parseInt(PORT);
		if (isNaN(port)) {
			throw new Error('PORT must be an integer');
		}
		httpPort = port;
	}

	const govNotifyDisabled = GOV_NOTIFY_DISABLED === 'true';
	if (!govNotifyDisabled) {
		const props = {
			GOV_NOTIFY_API_KEY,
			GOV_NOTIFY_OTP_TEMPLATE_ID
		};
		for (const [k, v] of Object.entries(props)) {
			if (v === undefined || v === '') {
				throw new Error(k + ' must be a non-empty string');
			}
		}
	}

	const blobStoreDisabled = BLOB_STORE_DISABLED === 'true';
	if (!blobStoreDisabled) {
		const props = {
			BLOB_STORE_HOST,
			BLOB_STORE_CONTAINER
		};
		for (const [k, v] of Object.entries(props)) {
			if (v === undefined || v === '') {
				throw new Error(k + ' must be a non-empty string');
			}
		}

		if (NODE_ENV === 'production' && BLOB_STORE_CONNECTION_STRING) {
			throw new Error(BLOB_STORE_CONNECTION_STRING + ' must only be used for local development');
		}
	}

	if (!SQL_CONNECTION_STRING) {
		throw new Error('SQL_CONNECTION_STRING is required');
	}

	const enableTestTools = ENABLE_E2E_TEST_ENDPOINTS === 'true';

	// If test tools are enabled, require a shared secret token to protect test endpoints
	if (enableTestTools && (!TEST_TOOLS_TOKEN || TEST_TOOLS_TOKEN.trim() === '')) {
		throw new Error('TEST_TOOLS_TOKEN must be a non-empty string when ENABLE_E2E_TEST_ENDPOINTS=true');
	}

	config = {
		blobStore: {
			disabled: BLOB_STORE_DISABLED === 'true',
			host: BLOB_STORE_HOST,
			container: BLOB_STORE_CONTAINER,
			connectionString: BLOB_STORE_CONNECTION_STRING
		},
		cacheControl: {
			maxAge: CACHE_CONTROL_MAX_AGE || '1d'
		},
		database: {
			datasourceUrl: SQL_CONNECTION_STRING
		},
		gitSha: GIT_SHA,
		govNotify: {
			disabled: govNotifyDisabled,
			apiKey: GOV_NOTIFY_API_KEY,
			templateIds: {
				oneTimePasswordNotification: GOV_NOTIFY_OTP_TEMPLATE_ID
			}
		},
		// the log level to use
		logLevel: LOG_LEVEL || 'info',
		NODE_ENV: NODE_ENV || 'development',
		// the HTTP port to listen on
		httpPort: httpPort,
		// the src directory
		srcDir: buildConfig.srcDir,
		session: {
			redisPrefix: 'portal:',
			redis: REDIS_CONNECTION_STRING,
			secret: SESSION_SECRET
		},
		// the static directory to serve assets from (images, css, etc..)
		staticDir: buildConfig.staticDir,

		// test tools
		enableE2eTestEndpoints: enableTestTools,
		testToolsToken: TEST_TOOLS_TOKEN
	};

	return config;
}

export interface BuildConfig {
	srcDir: string;
	staticDir: string;
}

/**
 * Config required for the build script
 * @returns {{srcDir: string, staticDir: string}}
 */
export function loadBuildConfig(): BuildConfig {
	// get the file path for the directory this file is in
	const dirname = path.dirname(fileURLToPath(import.meta.url));
	// get the file path for the src directory
	const srcDir = path.join(dirname, '..');
	// get the file path for the .static directory
	const staticDir = path.join(srcDir, '.static');

	return {
		srcDir,
		staticDir
	};
}
