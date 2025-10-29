class CommonLocators {
	saveAndContinueButton() {
		return cy.get("[data-cy='button-save-and-continue']");
	}
}

export default new CommonLocators();
