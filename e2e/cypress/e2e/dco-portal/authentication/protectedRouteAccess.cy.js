/// <reference types="cypress" />
import CommonActions from '../../../page_object/PageAction/commonActions.js';

/**
 * Covers access to protected application resources after authentication.
 */
describe('Protected route access', () => {
	/**
	 * Verifies that an authenticated user can open a document category.
	 * @previousName allows an authenticated user to access protected resources
	 */
	it('allows an authenticated user to access a document category', () => {
		CommonActions.login();

		cy.visit('/plans-and-drawings');
		cy.url().should('include', '/plans-and-drawings');
		cy.contains('h2', 'Plans and drawings').should('be.visible');
	});
});
