import { defineConfig } from 'cypress';
import { deleteDownloads, validateDownloadedFile } from './cypress/support/cypressUtils.js';
import { clearDocumentCategory } from './cypress/support/dbUtils.js';

// load env from this workspace (e2e/.env)
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadEnvFile } from 'node:process';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
// prettier-ignore
try { loadEnvFile(path.resolve(currentDir, '.env')); } catch {
	try { loadEnvFile(); } catch {/* ignore errors */}
}

export default defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			on('task', {
				DeleteDownloads: deleteDownloads,
				ValidateDownloadedFile: validateDownloadedFile,
				clearDocumentCategory
			});

			process.env.TZ = 'Europe/London';
			return config;
		},

		baseUrl: process.env.BASE_URL || 'http://localhost:9004/',

		env: {
			USER_EMAIL: process.env.USER_EMAIL || 'inspectorappeals.test@planninginspectorate.gov.uk',
			PASSWORD: process.env.USER_PASSWORD || '******',
			TEST_APPLICATION_REFERENCE: process.env.TEST_APPLICATION_REFERENCE || 'EN123456',
			TEST_TOOLS_TOKEN: process.env.TEST_TOOLS_TOKEN || 'secret',

			SQL_CONNECTION_STRING: process.env.SQL_CONNECTION_STRING,
			SQL_CONNECTION_STRING_ADMIN: process.env.SQL_CONNECTION_STRING_ADMIN
		},

		specPattern: `cypress/e2e/dco-portal/**/*.cy.js`,
		supportFile: './cypress/support/e2e.js',
		viewportHeight: 960,
		viewportWidth: 1536,
		defaultCommandTimeout: 30000,
		pageLoadTimeout: 60000,
		experimentalModifyObstructiveThirdPartyCode: true,
		experimentalRunAllSpecs: true,
		chromeWebSecurity: false,
		video: false,
		retries: 2,
		redirectionLimit: 50
	}
});
