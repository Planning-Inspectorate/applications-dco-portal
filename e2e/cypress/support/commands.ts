/// <reference types="cypress" />
import CommonActions from '../page_object/PageAction/commonActions.js';

Cypress.Commands.add('deleteDownloads', () => {
	cy.task('DeleteDownloads');
});

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

Cypress.Commands.add('getByData', (value) => {
	return cy.get(`[data-cy="${value}"]`);
});

/**
 * Reads one or more Cypress environment variables by name and yields them as a
 * plain object, making them available inside a `.then()` callback without
 * repeated `Cypress.env()` calls.
 *
 * @example
 * cy.readEnv(['USER_EMAIL', 'TEST_TOOLS_TOKEN']).then(({ USER_EMAIL, TEST_TOOLS_TOKEN }) => { ... });
 */
Cypress.Commands.add('readEnv', (names: string[]) => {
	const result = names.reduce<Record<string, unknown>>((acc, name) => {
		acc[name] = Cypress.env(name);
		return acc;
	}, {});
	return cy.wrap(result);
});

Cypress.Commands.add('loginSession', () => {
	cy.session(
		'authenticated-user',
		() => {
			CommonActions.login();
		},
		{
			validate() {
				// Cheap validation that proves we're still logged in
				cy.getCookie('session').should('exist');
			}
		}
	);
});
