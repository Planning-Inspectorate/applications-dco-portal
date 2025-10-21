// Import JSON files directly (Cypress supports this)
import common from '../PageLocators/Common.json';

export class HomePageActions {
	navigateToPage() {
		cy.visit('https://dco-portal-test.planninginspectorate.gov.uk');
		cy.get('h1').should('be.visible');
		cy.get(common.common.emailAddress).type(common.common.email);
		cy.get(common.common.continueButton).click();
		cy.get('h1').should('be.visible').contains('Enter the code we sent to your email address');
	}

	clickOnStartNowButton() {
		// Add implementation here
	}

	VerifyPage() {
		// Add implementation here
	}
}
