class HomePageLocators {
	emailInput() {
		return cy.get('input[name="emailAddress"]');
	}

	applicationNumberInput() {
		return cy.get('input[name="caseReference"]');
	}

	otpCodeInput() {
		return cy.get('input[name="otpCode"]');
	}
}

export default new HomePageLocators();
