/// <reference types="cypress" />
import HasApplicationNumberActions from '../../../page_object/PageAction/hasApplicationNumberActions.js';

/**
 * Covers the unauthenticated application-reference and access gateway.
 *
 * The separate sign-in and protected-route specs cover completed authentication
 * and access to protected resources.
 */
describe('Application reference and access gateway', () => {
	/**
	 * Verifies that the home page sends unauthenticated users to the gateway.
	 * @previousName Default path should redirect you to /login/application-reference-number
	 */
	it('redirects unauthenticated users from the home page to the application reference question', () => {
		cy.visit('/');
		cy.url().should('include', '/login/application-reference-number');
	});

	/**
	 * Verifies that protected routes cannot be accessed without authentication.
	 * @previousName Paths requiring authentication should redirect you to /login/application-reference-number
	 */
	it('redirects unauthenticated users from protected routes to the application reference question', () => {
		cy.visit('/plans-and-drawings');
		cy.url().should('include', '/login/application-reference-number');
	});

	/**
	 * Verifies that users with an application reference can proceed to sign-in.
	 * @previousName Answering "yes" that you have an application number takes you to the sign in page
	 */
	it('takes users with an application reference to the sign-in page', () => {
		cy.visit('/');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmHasApplicationNumber();
		cy.get('h1').should('be.visible').contains('Sign-in');
		cy.get('label').should('be.visible').contains('Email address');
		cy.get('label').should('be.visible').contains('Application reference number');
	});

	/**
	 * Verifies that users without an application reference receive access guidance.
	 * @previousName Answering "no" that you have an application number takes you to an access denied page
	 */
	it('shows access guidance to users without an application reference', () => {
		cy.visit('/');
		cy.url().should('include', '/application-reference-number');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmDoesNotHaveApplicationNumber();
		cy.url().should('include', '/login/no-access');
		cy.get('h2').should('be.visible').contains('You do not have access to this service');
		cy.get('.govuk-link').should('be.visible').contains('NIEnquiries@planninginspectorate.gov.uk');
		cy.get('.govuk-link').should('be.visible').contains('0303 444 5000');
	});
});
