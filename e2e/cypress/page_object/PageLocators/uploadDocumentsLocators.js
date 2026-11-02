/**
 * @file Page locators for document upload and category workflows.
 * @module page_object/PageLocators/uploadDocumentsLocators
 *
 * This class provides selectors for task lists, document uploads, regulation choices, and document tables.
 */

/**
 * Encapsulates selectors for document upload screens and metadata inputs.
 */
class UploadDocumentsLocators {
	/**
	 * Returns the list of document category task items on the dashboard.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The task item list elements chainable.
	 */
	taskList() {
		return cy.get('ul.govuk-task-list li.govuk-task-list__item');
	}

	/**
	 * Returns the button to initiate a document upload for a category.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The upload button element chainable.
	 */
	uploadDocumentsButton() {
		return cy.get('[data-cy="upload-documents-btn"]');
	}

	/**
	 * Returns the radio button inputs for document subcategory selection.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input elements chainable.
	 */
	getDocumentTypeRadioButtons() {
		return cy.get(`input[name="documentType"]`);
	}

	/**
	 * Returns the APFP regulation autocomplete input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	apfpRegulationTextbox() {
		return cy.get('#apfpRegulation');
	}

	/**
	 * Returns the radio button confirming that the document is certified.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	certifiedDocumentYesRadioButton() {
		return cy.get(`input[name="isCertified"][value="yes"]`);
	}

	/**
	 * Returns the radio button indicating that the document is not certified.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	certifiedDocumentNoRadioButton() {
		return cy.get(`input[name="isCertified"][value="no"]`);
	}

	/**
	 * Returns the final confirm upload button on the check answers screen.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The confirm button element chainable.
	 */
	confirmUploadButton() {
		return cy.get('.govuk-button').contains(/Confirm upload/i);
	}

	/**
	 * Returns the table containing uploaded document rows.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The table element chainable.
	 */
	uploadedDocumentsTable() {
		return cy.get('.govuk-table');
	}
}

export default new UploadDocumentsLocators();
