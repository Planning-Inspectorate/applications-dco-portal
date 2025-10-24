/// <reference types="cypress" />

// Initialize but comment out for now if not using
// const homePageActions = new HomePageActions();

describe('DCO Portal Home Page Test', () => {
	it('Answering "yes" that you have an application number takes you to the sign in page', () => {
		//homePageActions.navigateToPage();
		cy.visit('/');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		cy.get('input[name="hasReferenceNumber"][value="yes"]').check();
		cy.get("[data-cy='button-save-and-continue']").click();
		cy.get('h1').should('be.visible').contains('Sign-in');
		cy.get('label').should('be.visible').contains('Email address');
		cy.get('label').should('be.visible').contains('Application reference number');
	});

	it('Answering "no" that you have an application number takes you to an access denied page', () => {
		//homePageActions.navigateToPage();
		cy.visit('/');
		cy.get('h1').should('be.visible').contains('Do you have an application reference number?');
		cy.get('input[name="hasReferenceNumber"][value="no"]').check();
		cy.get("[data-cy='button-save-and-continue']").click();
		cy.get('h2').should('be.visible').contains('You do not have access to this service');
		cy.get('.govuk-link').should('be.visible').contains('NIEnquiries@planninginspectorate.gov.uk'); //support email address
		cy.get('.govuk-link').should('be.visible').contains('0303 444 5000'); //support telephone number
	});
});
