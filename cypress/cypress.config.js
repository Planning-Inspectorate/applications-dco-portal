import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: '',
		setupNodeEvents(/* on, config */) {
			// implement node event listeners here
		}
	}
});
