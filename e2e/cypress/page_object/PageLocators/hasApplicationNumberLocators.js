class HasApplicationNumberLocators {
	yesRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="yes"]');
	}
	noRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="no"]');
	}
	saveAndContinueButton() {
		return cy.get("[data-cy='button-save-and-continue']");
	}
}

export default new HasApplicationNumberLocators();
