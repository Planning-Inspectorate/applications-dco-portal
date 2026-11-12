/**
 * @file Custom Cypress commands for end-to-end testing.
 * @module support/commands
 *
 * This module defines global Cypress commands for the test suite.
 * These commands simplify user authentication, element selection, and download checks.
 */

/// <reference types="cypress" />
import CommonActions from '../page_object/PageAction/commonActions.js';

/**
 * Custom command to remove all files from the downloads folder.
 * Executes the DeleteDownloads Node task.
 */
Cypress.Commands.add('deleteDownloads', () => {
	cy.task('DeleteDownloads');
});

/**
 * Custom command to check that a file was downloaded.
 * Throws an error when the file does not exist.
 *
 * @param {string} fileName - The name of the file to verify.
 */
Cypress.Commands.add('validateDownloadedFile', (fileName) => {
	cy.task('ValidateDownloadedFile', fileName).then((success) => {
		if (success) {
			/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
			expect(success).to.be.true;
		} else {
			throw new Error(`${fileName} was not found. The file was either not downloaded or the file name is not correct.`);
		}
	});
});

/**
 * Custom command to locate a DOM element by its data-cy attribute.
 *
 * @param {string} value - The data-cy attribute value.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The matched DOM element chainable.
 */
Cypress.Commands.add('getByData', (value) => {
	return cy.get(`[data-cy="${value}"]`);
});

/**
 * Custom command to send a direct authentication request for test users.
 *
 * @param {string} emailAddress - The email address of the test user.
 * @param {string} caseReference - The reference code of the case.
 */
Cypress.Commands.add('testLogin', (emailAddress, caseReference) => {
	cy.request('POST', '/login/test', { emailAddress, caseReference });
});

/**
 * Custom command to create or restore an authenticated user session.
 * Caches session cookies across tests to avoid repeated login steps.
 */
Cypress.Commands.add('loginSession', () => {
	cy.session(
		'authenticated-user',
		() => {
			CommonActions.login();
		},
		{
			validate() {
				// Validate that the session cookie exists
				cy.getCookie('session').should('exist');
			}
		}
	);
});
