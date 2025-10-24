import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';
import 'dotenv/config';

// use backoffice defaults if not set
if (!baseConfig.e2e.baseUrl) {
	baseConfig.e2e.baseUrl = 'https://localhost:8080/';
}

export default defineConfig({
	e2e: {
		...baseConfig.e2e
	},
	env: {
		...baseConfig.env
	}
});
