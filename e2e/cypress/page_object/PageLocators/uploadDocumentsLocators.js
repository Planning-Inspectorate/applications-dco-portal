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
}

export default new uploadDocumentsLocators();
