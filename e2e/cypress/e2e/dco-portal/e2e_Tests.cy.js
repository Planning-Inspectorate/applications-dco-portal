/// <reference types="cypress" />
import common from '../../page_object/PageLocators/Common.json';

// Initialize but comment out for now if not using
// const homePageActions = new HomePageActions();

describe('DCO Portal Home Page Test', () => {
	it('Verify that user enters valid email', () => {
		//homePageActions.navigateToPage();
		cy.visit('/');
		cy.get('label').contains('What is your email address?');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.email);
		cy.get(common.common.continueButton).click();
		cy.get('h1').should('be.visible').contains('Enter the code we sent to your email address');
	});

	it('Verify that user enters invalid email', () => {
		//homePageActions.navigateToPage();
		cy.visit('/');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.wrongEmail);
		cy.get(common.common.continueButton).click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('h2').should('be.visible').contains('There is a problem');
		cy.get('a').should('be.visible').contains('Invalid email address');
	});

	/*
	it('Verify that user enters email unlisted email', () => {
		//homePageActions.navigateToPage();
		cy.visit('/');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.emailAddressError);
		cy.get(common.common.continueButton).click();
		cy.get('h1').should('be.visible').contains('Sorry, there was an error');
	});
	*/
});
