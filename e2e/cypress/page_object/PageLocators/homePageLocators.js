class HomePageLocators {
	emailInput() {
		return cy.get('input[name="emailAddress"]');
	}

	applicationNumberInput() {
		return cy.get('input[name="caseReference"]');
	}
}

export default new HomePageLocators();
