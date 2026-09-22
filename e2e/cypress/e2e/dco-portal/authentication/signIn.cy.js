/// <reference types="cypress" />
import CommonActions from '../../../page_object/PageAction/commonActions.js';

/**
 * Covers the complete sign-in journey for an invited DCO Portal user.
 *
 * The shared login action provisions the test case, submits the user's
 * credentials, enters the deterministic end-to-end OTP, and completes sign-in.
 */
describe('User sign-in', () => {
	/**
	 * Verifies that a successfully authenticated user reaches the application task list.
	 */
	it('authenticates an invited user and displays the application task list', () => {
		CommonActions.login();

		cy.url().should('eq', `${Cypress.config('baseUrl')}`);
		cy.contains('h2', '1. Your documents').should('be.visible');
		cy.contains('h2', '2. Your application').should('be.visible');
	});
});
