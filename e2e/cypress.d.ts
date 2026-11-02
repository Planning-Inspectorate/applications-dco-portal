/**
 * @file TypeScript type definitions for custom Cypress commands.
 * @module cypress.d.ts
 *
 * This file extends the global Cypress namespace with custom helper commands.
 */

/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		/**
		 * Deletes all files in the downloads directory.
		 */
		deleteDownloads(): Chainable<void>;

		/**
		 * Validates that a file was downloaded successfully.
		 *
		 * @param fileName - The name of the downloaded file.
		 */
		validateDownloadedFile(fileName: string): Chainable<void>;

		/**
		 * Selects an element by its data-cy attribute.
		 *
		 * @param value - The value of the data-cy attribute.
		 */
		getByData(value: string): Chainable<JQuery<HTMLElement>>;

		/**
		 * Submits a direct authentication request for test users.
		 *
		 * @param emailAddress - The email address of the test user.
		 * @param caseReference - The reference code of the case.
		 */
		testLogin(emailAddress: string, caseReference: string): Chainable<void>;

		/**
		 * Creates or restores an authenticated user session.
		 */
		loginSession(): Chainable<void>;
	}
}
