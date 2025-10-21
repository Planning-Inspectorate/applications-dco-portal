/// <reference types="cypress" />
import { HomePageActions } from './Pages/PageAction/HomePageActions.cy';
import common from './Pages/PageLocators/Common.json';

// Initialize but comment out for now if not using
// const homePageActions = new HomePageActions();

describe('DCO Portal Home Page Test', () => {
	it('Verify that user enters valid email', () => {
		//homePageActions.navigateToPage();
		cy.visit('https://dco-portal-test.planninginspectorate.gov.uk');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.email);
		cy.get(common.common.continueButton).click();
		cy.get('h1').should('be.visible').contains('Enter the code we sent to your email address');
	});

	it('Verify that user enters invalid email', () => {
		//homePageActions.navigateToPage();
		cy.visit('https://dco-portal-test.planninginspectorate.gov.uk');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.wrongEmail);
		cy.get(common.common.continueButton).click();
		cy.get('#email-address-error').should('be.visible').contains('Error message');
		//cy.get('h1').should('be.visible').contains('Enter the code we sent to your email address')
	});

	it('Verify that user enters email unlisted email', () => {
		//homePageActions.navigateToPage();
		cy.visit('https://dco-portal-test.planninginspectorate.gov.uk');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.emailAddressError);
		cy.get(common.common.continueButton).click();
		cy.get('h1').should('be.visible').contains('Sorry, there was an error');
	});
});
