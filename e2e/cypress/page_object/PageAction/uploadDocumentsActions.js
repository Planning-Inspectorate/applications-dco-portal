import UploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';
import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Actions for navigating and preparing document-category upload journeys.
 */
class UploadDocumentsActions {
	/**
	 * Opens a document category from the application task list.
	 *
	 * Task-list indexes are zero-based.
	 *
	 * @param {number} index - The zero-based task-list index.
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The task link click chain.
	 */
	openTask(index) {
		return UploadDocumentsLocators.taskList().eq(index).find('a').click();
	}

	/**
	 * Clears the saved database and blob-storage state for one document category.
	 *
	 * @param {string} documentTypeId - The document category identifier.
	 * @returns {Cypress.Chainable<unknown>} The cleanup task chain.
	 */
	clearDocumentCategory(documentTypeId) {
		return cy.readEnv(['TEST_APPLICATION_REFERENCE']).then(({ TEST_APPLICATION_REFERENCE }) =>
			cy.task('clearDocumentCategory', {
				documentTypeId,
				reference: TEST_APPLICATION_REFERENCE
			})
		);
	}

	/**
	 * Logs in, opens a document category, and reaches the document-type page.
	 * When a category identifier is supplied, its persisted test state is cleared
	 * after login and before the category is opened.
	 *
	 * @param {number} taskIndex - The zero-based task-list index.
	 * @param {string} [documentTypeId] - The optional document category identifier to clear.
	 * @returns {Cypress.Chainable<unknown>} The completed upload-page setup chain.
	 */
	reachDocumentUploadPage(taskIndex, documentTypeId) {
		CommonActions.login();
		const openUploadPage = () => {
			this.openTask(taskIndex);
			UploadDocumentsLocators.uploadDocumentsButton().click();
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			return CommonLocators.saveAndContinueButton().click();
		};

		if (documentTypeId) {
			return (
				openUploadPage()
					.then(() => this.removeAllStagedUploads())
					.then(() => this.clearDocumentCategory(documentTypeId))
					// Reload the page to ensure we are in a clean state after DB wipe
					.then(() => cy.reload())
			);
		}

		return openUploadPage().then(() => this.removeAllStagedUploads());
	}
	/**
	 * Removes every staged (not-yet-committed) file from the upload-documents page
	 * by clicking each Remove link in turn.
	 *
	 * This uses the app's own delete route (`POST .../delete/:blobId`) so both
	 * blob storage and session state are cleaned up without relying on the Cypress
	 * task's blob-store configuration.
	 *
	 * @returns {Cypress.Chainable<void>} The completed removal chain.
	 */
	removeAllStagedUploads() {
		return cy.get('body').then(($body) => {
			const count = $body.find('.js-remove-link').length;
			if (count > 0) {
				cy.intercept('POST', '**/delete/**').as('deleteUpload');
				for (let i = 0; i < count; i++) {
					cy.get('.js-remove-link').first().click();
					cy.wait('@deleteUpload');
				}
			}
		});
	}
}

export default new UploadDocumentsActions();
