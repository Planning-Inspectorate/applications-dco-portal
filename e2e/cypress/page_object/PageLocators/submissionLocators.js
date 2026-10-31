class SubmissionLocators {
	firstNameInput() {
		return cy.get('input[name="declarationFirstName"]');
	}

	lastNameInput() {
		return cy.get('input[name="declarationLastName"]');
	}

	orgInput() {
		return cy.get('input[name="declarationOrganisation"]');
	}

	positionInput() {
		return cy.get('input[name="positionInOrganisation"]');
	}

	confirmationCheckbox() {
		return cy.get('input[name="declarationConfirmation"][value="confirm"]');
	}

	submitButton() {
		return cy.get('.govuk-button').contains(/Confirm and submit/i);
	}

	completePanel() {
		return cy.get('.govuk-panel');
	}
}

export default new SubmissionLocators();
