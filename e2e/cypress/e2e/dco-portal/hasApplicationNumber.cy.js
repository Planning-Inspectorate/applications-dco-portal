/**
 * @file End-to-end tests for unauthenticated entry routing and application reference checks.
 * @module e2e/dco-portal/hasApplicationNumber
 *
 * This test suite validates landing redirects, protected route gateways, and access decisions.
 */

/// <reference types="cypress" />
import HasApplicationNumberActions from '../../page_object/PageAction/hasApplicationNumberActions.js';

describe('Has Application Number page', () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.clearAllSessionStorage();
	});

	/**
	 * Verifies that visiting the root path redirects unauthenticated users to the application number question.
	 */
	it('Default path should redirect you to /login/application-reference-number', () => {
		cy.visit('/');
		cy.url().should('include', '/login/application-reference-number');
	});

	/**
	 * Verifies that attempting to access a protected application section redirects unauthenticated users to the reference check.
	 */
	it('Paths requiring authentication should redirect you to /login/application-reference-number', () => {
		cy.visit('/plans-and-drawings');
		cy.url().should('include', '/login/application-reference-number');
	});

	/**
	 * Verifies that selecting yes to having an application number advances the user to the sign-in page.
	 */
	it('Answering "yes" that you have an application number takes you to the sign-in page', () => {
		cy.visit('/');
		cy.url().should('include', '/login/application-reference-number');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmHasApplicationNumber();
		cy.url().should('include', '/login/sign-in');
		cy.get('h1').should('be.visible').contains('Sign-in');
		cy.get('label').should('be.visible').contains('Email address');
		cy.get('label').should('be.visible').contains('Application reference number');
	});

	/**
	 * Verifies that selecting no to having an application number directs the user to an access denied page with support contact info.
	 */
	it('Answering "no" that you have an application number takes you to an access denied page', () => {
		cy.visit('/');
		cy.url().should('include', '/application-reference-number');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmDoesNotHaveApplicationNumber();
		cy.get('h2').should('be.visible').contains('You do not have access to this service');
		cy.get('.govuk-link').should('be.visible').contains('NIEnquiries@planninginspectorate.gov.uk');
		cy.get('.govuk-link').should('be.visible').contains('0303 444 5000');
	});
});
