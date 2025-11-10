/// <reference types="cypress" />
import HasApplicationNumberActions from '../../page_object/PageAction/hasApplicationNumberActions.js';

describe('Has Application Number page', () => {
	it('Default path should redirect you to /login/application-reference-number', () => {
		cy.visit('/');
		cy.url().should('include', '/login/application-reference-number');
	});

	it('Paths requiring authentication should redirect you to /login/application-reference-number', () => {
		cy.visit('/plans-and-drawings');
		cy.url().should('include', '/login/application-reference-number');
	});

	it('Answering "yes" that you have an application number takes you to the sign in page', () => {
		cy.visit('/');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmHasApplicationNumber();
		cy.get('h1').should('be.visible').contains('Sign-in');
		cy.get('label').should('be.visible').contains('Email address');
		cy.get('label').should('be.visible').contains('Application reference number');
	});

	it('Answering "no" that you have an application number takes you to an access denied page', () => {
		cy.visit('/');
		cy.url().should('include', '/application-reference-number');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		HasApplicationNumberActions.confirmDoesNotHaveApplicationNumber();
		cy.get('h2').should('be.visible').contains('You do not have access to this service');
		cy.get('.govuk-link').should('be.visible').contains('NIEnquiries@planninginspectorate.gov.uk'); //support email address
		cy.get('.govuk-link').should('be.visible').contains('0303 444 5000'); //support telephone number
	});
});
