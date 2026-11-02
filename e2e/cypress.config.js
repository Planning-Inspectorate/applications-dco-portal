/**
 * @file Base Cypress configuration for end-to-end tests.
 * @module cypress.config
 *
 * This file configures the Cypress test runner for the DCO Portal application.
 * It registers custom Node tasks for database cleanup and file operations.
 * It also loads environment variables from the local environment file.
 */

import { defineConfig } from 'cypress';
import { deleteDownloads, validateDownloadedFile } from './cypress/support/cypressUtils.js';
import {
	clearDocumentCategory,
	deleteWhitelistUser,
	setupCaseForSubmission,
	resetCase
} from './cypress/support/dbUtils.js';

// Load environment variables from the local workspace (e2e/.env)
import { loadEnvFile } from 'node:process';
// prettier-ignore
try { loadEnvFile(); } catch {/* ignore errors */}

export default defineConfig({
	e2e: {
		/**
		 * Configures Cypress event listeners and registers custom Node tasks.
		 *
		 * @param {Cypress.PluginEvents} on - The Cypress event subscriber function.
		 * @param {Cypress.PluginConfigOptions} config - The resolved Cypress test runner configuration.
		 * @returns {Promise<Cypress.PluginConfigOptions>} The modified configuration object.
		 */
		async setupNodeEvents(on, config) {
			on('task', {
				DeleteDownloads: deleteDownloads,
				ValidateDownloadedFile: validateDownloadedFile,
				clearDocumentCategory,
				deleteWhitelistUser,
				setupCaseForSubmission,
				resetCase
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
