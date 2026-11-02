/**
 * @file Cypress configuration for the test staging environment.
 * @module cypress.config.test.env
 *
 * This file extends the base Cypress configuration for the test staging environment.
 * It targets the hosted test staging portal deployment.
 */

import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';
import { loadEnvFile } from 'node:process';
// prettier-ignore
try { loadEnvFile(); } catch {/* ignore errors */}

const e2eOverride = {
	baseUrl: 'https://back-office-appeals-test.planninginspectorate.gov.uk/'
};

export default defineConfig({
	e2e: {
		...baseConfig.e2e,
		...e2eOverride
	},
	env: {
		...baseConfig.env
	}
});
