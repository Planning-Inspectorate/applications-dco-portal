class uploadDocumentsLocators {
	taskList() {
		return cy.get('ul.govuk-task-list li.govuk-task-list__item');
	}

	uploadDocumentsButton() {
		return cy.get('[data-cy="upload-documents-btn"]');
	}

	getDocumentTypeRadioButtons() {
		return cy.get(`input[name="documentType"]`);
	}

	apfpRegulationTextbox() {
		return cy.get('#apfpRegulation');
	}

	certifiedDocumentYesRadioButton() {
		return cy.get(`input[name="isCertified"][value="yes"]`);
	}

	certifiedDocumentNoRadioButton() {
		return cy.get(`input[name="isCertified"][value="no"]`);
	}

	/**
	 * Returns all "Remove" links for staged (not-yet-committed) uploads on the
	 * upload-documents page. Each link submits its backing delete form which
	 * removes the file from blob storage and session state.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} All Remove links.
	 */
	removeUploadedFileLinks() {
		return cy.get('.js-remove-link');
	}
}

export default new uploadDocumentsLocators();
