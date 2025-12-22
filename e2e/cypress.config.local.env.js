import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';

export default defineConfig({
	e2e: {
		...baseConfig.e2e,
		// local fallback if BASE_URL isn't set
		baseUrl: baseConfig.e2e.baseUrl || 'http://localhost:8080/'
	},
	env: {
		...baseConfig.env
	}
});
