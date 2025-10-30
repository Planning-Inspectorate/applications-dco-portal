class uploadDocumentsLocators {
	taskList() {
		return cy.get('ul.govuk-task-list li.govuk-task-list__item');
	}

	uploadDocumentsButton() {
		return cy.get('[data-cy="upload-documents-btn"]');
	}

	getDocumentTypeRadioButtonByValue(value) {
		return cy.get(`input[name="documentType"][value="${value}"]`);
	}

	apfpRegulationTextbox() {
		return cy.get('#apfpRegulation');
	}
}

export default new uploadDocumentsLocators();
