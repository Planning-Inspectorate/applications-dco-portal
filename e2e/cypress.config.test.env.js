import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';
import { loadEnvFile } from 'node:process';
// prettier-ignore
try { loadEnvFile(); } catch {/* ignore errors*/}

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
