/**
 * @file Cypress configuration for the cloud development environment.
 * @module cypress.config.dev.env
 *
 * This file extends the base Cypress configuration for the development environment.
 * It targets the hosted development portal deployment.
 */

import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';
import { loadEnvFile } from 'node:process';
// prettier-ignore
try { loadEnvFile(); } catch {/* ignore errors */}

const e2eOverride = {
	baseUrl: 'https://back-office-appeals-dev.planninginspectorate.gov.uk/'
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
