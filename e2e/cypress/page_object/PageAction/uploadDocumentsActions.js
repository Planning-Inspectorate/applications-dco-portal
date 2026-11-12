/**
 * @file User actions for document upload and category workflows.
 * @module page_object/PageAction/uploadDocumentsActions
 *
 * This class provides actions for uploading files, choosing metadata, and verifying uploaded document tables.
 */

import UploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';
import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Encapsulates actions for uploading and validating application documents.
 */
class UploadDocumentsActions {
	/**
	 * Clicks a task link in the document task list by numeric index or route fragment.
	 *
	 * @param {number|string} indexOrFragment - The zero-based index or URL path fragment of the task.
	 * @returns {void}
	 */
	openTask(indexOrFragment) {
		if (typeof indexOrFragment === 'number') {
			UploadDocumentsLocators.taskList().eq(indexOrFragment).find('a').click();
		} else {
			cy.get(`a[href*="${indexOrFragment}"]`).first().click();
		}
	}

	/**
	 * Navigates to a specific document category overview page.
	 *
	 * @param {number} taskIndex - The index of the category in the task list.
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @returns {void}
	 */
	openCategory(taskIndex, fragment) {
		CommonActions.login();
		cy.contains('h2', 'Your documents').should('be.visible');
		this.openTask(taskIndex);
		cy.url().should('include', fragment);
	}

	/**
	 * Clicks the upload documents button to begin the upload journey.
	 *
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @returns {void}
	 */
	startUpload(fragment) {
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', `${fragment}/upload/document-type`);
	}

	/**
	 * Selects the first available document subcategory radio button and continues.
	 * Stores the chosen document type name in an alias for later assertions.
	 *
	 * @returns {void}
	 */
	selectFirstDocumentType() {
		cy.contains('h1', 'Select the document type').should('be.visible');
		UploadDocumentsLocators.getDocumentTypeRadioButtons()
			.eq(0)
			.invoke('attr', 'id')
			.then((id) => {
				cy.get(`label[for="${id}"]`)
					.invoke('text')
					.then((text) => cy.wrap(text.trim()).as('selectedDocumentType'));
			});
		UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Attaches a file to the upload input and submits the upload form.
	 *
	 * @param {string} file - The relative path to the test fixture file.
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @returns {void}
	 */
	uploadFile(file, fragment) {
		cy.contains('h1', 'Upload your documents').should('be.visible');
		cy.url().should('include', `${fragment}/upload/upload-documents`);
		cy.get('input[type="file"]').selectFile(file, { force: true });
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(500);
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Chooses an APFP regulation from the autocomplete dropdown.
	 *
	 * @param {string} [value='5'] - The regulation search character or string.
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @returns {void}
	 */
	selectRegulation(value = '5', fragment) {
		cy.contains('h1', 'Select the relevant APFP regulation').should('be.visible');
		cy.url().should('include', `${fragment}/upload/regulation`);
		UploadDocumentsLocators.apfpRegulationTextbox().type(value);
		cy.get('.autocomplete__option').first().click();
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Selects yes on the certified document choice page and continues.
	 *
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @returns {void}
	 */
	selectCertifiedYes(fragment) {
		cy.contains('h1', /Will the document be certified/i).should('be.visible');
		cy.url().should('include', `${fragment}/upload/document-certified`);
		UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Asserts that the check your answers summary displays the expected upload metadata.
	 *
	 * @param {string} fragment - The URL fragment identifying the category.
	 * @param {string} [fileName='uploadTest.pdf'] - The expected document file name.
	 * @param {string} [regulation='5'] - The expected APFP regulation.
	 * @param {string} [certified='Yes'] - The expected certification answer.
	 * @returns {void}
	 */
	assertCheckYourAnswers(fragment, fileName = 'uploadTest.pdf', regulation = '5', certified = 'Yes') {
		cy.contains('h1', /Check your answers before uploading your document/i).should('be.visible');
		cy.url().should('include', `${fragment}/check-your-answers`);
		cy.get('.govuk-summary-list').should('be.visible');
		cy.get('@selectedDocumentType').then((type) => {
			cy.get('.govuk-summary-list').contains(type);
		});
		cy.get('.govuk-summary-list').contains(fileName);
		cy.get('.govuk-summary-list').contains(regulation);
		cy.get('.govuk-summary-list').contains(certified);
	}

	/**
	 * Clicks continue without providing input and verifies that the expected validation error appears.
	 *
	 * @param {string} expectedMessage - The error message text to assert.
	 * @returns {void}
	 */
	continueAndAssertError(expectedMessage) {
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
		cy.contains('a', expectedMessage).should('be.visible');
	}

	/**
	 * Navigates directly through category and document type selection to reach the file upload page.
	 *
	 * @param {number|string} taskIndexOrFragment - The category index or route fragment.
	 * @returns {void}
	 */
	reachDocumentUploadPage(taskIndexOrFragment) {
		CommonActions.login();
		this.openTask(taskIndexOrFragment);
		UploadDocumentsLocators.uploadDocumentsButton().click();
		UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Confirms document upload on the check answers page and verifies that the file appears in the document table.
	 *
	 * @param {string} urlFragment - The category URL fragment.
	 * @param {string} fileName - The expected file name in the table.
	 * @returns {void}
	 */
	confirmUploadAndVerify(urlFragment, fileName) {
		UploadDocumentsLocators.confirmUploadButton().click();
		cy.url().should('include', urlFragment);
		cy.get('.govuk-heading-m').contains('Documents uploaded').should('be.visible');
		UploadDocumentsLocators.uploadedDocumentsTable().should('contain.text', fileName);
	}
}

export default new UploadDocumentsActions();
