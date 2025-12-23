/* eslint-env node */
/* global process */

import { defineConfig } from 'cypress';
import { deleteDownloads, validateDownloadedFile } from './cypress/support/cypressUtils.js';
import { clearDocumentCategory } from './cypress/support/dbUtils.js';

import dotenv from 'dotenv';
import path from 'path';

// Always load env from this workspace (e2e/.env)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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

		baseUrl: process.env.BASE_URL,

		env: {
			USER_EMAIL: process.env.USER_EMAIL,
			PASSWORD: process.env.USER_PASSWORD,
			TEST_APPLICATION_REFERENCE: process.env.TEST_APPLICATION_REFERENCE,
			TEST_TOOLS_TOKEN: process.env.TEST_TOOLS_TOKEN,

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
