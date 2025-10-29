class HasApplicationNumberLocators {
	yesRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="yes"]');
	}
	noRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="no"]');
	}
}

export default new HasApplicationNumberLocators();
