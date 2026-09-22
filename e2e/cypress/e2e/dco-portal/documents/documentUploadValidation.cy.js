/// <reference types="cypress" />
import UploadDocumentsActions from '../../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../../page_object/PageLocators/commonLocators.js';
import CommonActions from '../../../page_object/PageAction/commonActions.js';
import { DOCUMENT_CATEGORIES } from '../../../support/utils/documentUploadTestData.js';

const DEFAULT_UPLOAD = 'cypress/fixtures/uploadTest.pdf';

/**
 * Covers required-field and unsupported-file validation for document uploads.
 */
const documentUploadValidationTests = ({ name, index, fragment }) => {
	const urlFor = (path) => `${fragment}${path}`;
	const documentTypeId = fragment.slice(1);
	const clickContinue = () => CommonLocators.saveAndContinueButton().click();

	const assertErrorSummary = () => {
		cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
	};

	/**
	 * Reaches the document-type selection page WITHOUT pre-selecting a radio.
	 * Clears the category so the session has no saved answer for documentType.
	 */
	const reachDocumentTypePage = () => {
		UploadDocumentsActions.clearDocumentCategory(documentTypeId);
		CommonActions.login();
		cy.visit('/');
		UploadDocumentsActions.openTask(index);
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', urlFor('/upload/document-type'));
	};

	const reachUploadDocumentsPage = () => {
		UploadDocumentsActions.reachDocumentUploadPage(index, documentTypeId);
	};

	describe(name, () => {
		it('shows validation errors when required upload answers are missing', () => {
			reachDocumentTypePage();

			// 1. Submit document-type page with nothing selected
			clickContinue();
			assertErrorSummary();
			cy.contains('a', 'Select the document type');

			// 2. Select a document type and advance to the upload page
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			clickContinue();

			// 3. Submit the upload page with no file selected
			clickContinue();
			assertErrorSummary();
			cy.contains('a', 'Select a file to upload');

			// Selecting a file auto-submits its own form to the /upload endpoint and the server then
			// redirects back to this page; wait for the request AND the resulting reload to land
			// (the govuk-frontend status text updates client-side before either completes).
			cy.intercept('POST', '**/upload').as('fileUpload');
			cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });
			cy.wait('@fileUpload');
			cy.get('.govuk-summary-list').should('contain', 'uploadTest.pdf');
			clickContinue();

			// 4. Select APFP regulation and advance to the certification page
			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').first().click();
			clickContinue();

			// 5. Submit the certification page with nothing selected
			clickContinue();
			assertErrorSummary();
			cy.contains('a', 'Select yes if the document is certified');
		});

		it('rejects an unsupported file type', () => {
			reachUploadDocumentsPage();
			cy.get('input[type="file"]').selectFile('cypress/fixtures/invalidFileType.txt', { force: true });

			assertErrorSummary();
			cy.contains('the file must be an approved format');
		});
	});
};

describe('Document upload validation', () => {
	DOCUMENT_CATEGORIES.forEach(documentUploadValidationTests);
});
