import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress';

export default defineConfig([
	eslint.configs.recommended,
	tseslint.configs.recommended,
	globalIgnores([
		'.husky',
		'dist/**',
		'node_modules/**',
		'**/*.test.ts',
		'**/.static/**',
		'packages/database/src/client/**',
		'cypress/e2e/1-getting-started/**',
		'cypress/e2e/2-advanced-examples/**'
	]),
	eslintConfigPrettier,
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	// Cypress-specific configuration
	{
		files: ['cypress/**/*.js', 'cypress/**/*.ts', '**/*.cy.js', '**/*.cy.ts'],
		plugins: {
			cypress
		},
		languageOptions: {
			globals: {
				cy: 'readonly',
				Cypress: 'readonly',
				describe: 'readonly',
				it: 'readonly',
				beforeEach: 'readonly',
				afterEach: 'readonly',
				before: 'readonly',
				after: 'readonly',
				expect: 'readonly',
				assert: 'readonly',
				context: 'readonly',
				console: 'readonly',
				localStorage: 'readonly',
				sessionStorage: 'readonly',
				setTimeout: 'readonly',
				require: 'readonly'
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'no-undef': 'off',
			'cypress/no-unnecessary-waiting': 'warn',
			'cypress/assertion-before-screenshot': 'warn',
			'cypress/no-force': 'warn'
		}
	}
]);
