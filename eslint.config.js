import { defineConfig } from 'eslint/config';
import { eslintConfig } from '@planning-inspectorate/coding-standards';
import cypress from 'eslint-plugin-cypress';

export default defineConfig([
	...eslintConfig,
	{
		files: ['e2e/**/*.{js,ts}'],
		extends: [cypress.configs.globals],
		plugins: {
			cypress
		},
		rules: {
			'cypress/no-unnecessary-waiting': 'warn',
			'cypress/assertion-before-screenshot': 'warn',
			'cypress/no-force': 'warn'
		}
	}
]);
