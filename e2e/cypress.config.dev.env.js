import { defineConfig } from 'cypress';
import baseConfig from './cypress.config.js';
import 'dotenv/config';

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
