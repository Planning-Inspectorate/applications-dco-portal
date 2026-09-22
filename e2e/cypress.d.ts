/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		deleteDownloads(): Chainable<void>;
		validateDownloadedFile(fileName: string): Chainable<void>;
		getByData(value: string): Chainable<jQuery<HTMLElement>>;
		/**
		 * Reads the given Cypress env-var names and yields them as a plain object.
		 *
		 * @param names - Array of Cypress.env() key names to read.
		 * @returns A Chainable that yields `Record<string, unknown>`.
		 */
		readEnv(names: string[]): Chainable<Record<string, unknown>>;
		loginSession(): Chainable<void>;
	}
}
