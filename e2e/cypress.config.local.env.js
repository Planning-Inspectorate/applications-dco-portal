/**
 * @file Cypress configuration for the local development environment.
 * @module cypress.config.local.env
 *
 * This file extends the base Cypress configuration for local testing.
 * It provides a default base URL if the BASE_URL variable is not set.
 */

import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';

export default defineConfig({
	e2e: {
		...baseConfig.e2e,
		// Provide a default base URL for local execution
		baseUrl: baseConfig.e2e.baseUrl || 'http://localhost:8080/'
	},
	env: {
		...baseConfig.env
	}
});
