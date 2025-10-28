import homePageLocators from '../PageLocators/homePageLocators.js';

export class HomePageActions {
	enterEmailAddress(email) {
		homePageLocators.emailInput().clear().type(email);
	}

	enterApplicationNumber(applicationNumber) {
		homePageLocators.applicationNumberInput().clear().type(applicationNumber);
	}

	submitLoginDetails() {
		cy.get("[data-cy='button-save-and-continue']").click();
	}

	login(email, applicationNumber) {
		this.enterEmailAddress(email);
		this.enterApplicationNumber(applicationNumber);
		this.submitLoginDetails();
	}
}

export default new HomePageActions();
