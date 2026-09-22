class CommonLocators {
	saveAndContinueButton() {
		return cy.get('.govuk-button').contains(/Save and continue|Continue|Submit|Accept|Confirm|Save and return/i);
	}
}

export default new CommonLocators();
