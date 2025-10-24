/* eslint-env node */
/* global process */

import { defineConfig } from 'cypress';
import { deleteDownloads, deleteUnwantedFixtures, validateDownloadedFile } from './cypress/support/cypressUtils.js';

import 'dotenv/config';

export default defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			on('task', {
				DeleteDownloads: deleteDownloads,
				DeleteUnwantedFixtures: deleteUnwantedFixtures,
				ValidateDownloadedFile: validateDownloadedFile
			});
			// Set timezone explicitly for CI consistency
			process.env.TZ = 'Europe/London';

			return config;
		},
		baseUrl: process.env.BASE_URL,
		env: {
			USER_EMAIL: process.env.USER_EMAIL,
			PASSWORD: process.env.USER_PASSWORD
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
		retries: 0,
		redirectionLimit: 50
	}
});
