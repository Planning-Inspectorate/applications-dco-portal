/// <reference types="cypress" />
import UploadDocumentsActions from '../../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../../page_object/PageLocators/commonLocators.js';
import { DOCUMENT_CATEGORIES } from '../../../support/utils/documentUploadTestData.js';

const DEFAULT_UPLOAD = 'cypress/fixtures/uploadTest.pdf';

/**
 * Covers the completed document upload journey for each selected document category.
 */
const documentUploadJourneyTests = ({ name, index, fragment }) => {
	const urlFor = (path) => `${fragment}${path}`;
	const documentTypeId = fragment.slice(1);
	const clickContinue = () => CommonLocators.saveAndContinueButton().click();

	const openCategory = () => {
		UploadDocumentsActions.reachDocumentUploadPage(index, documentTypeId).then(() => {
			cy.visit('/');
			cy.contains('h2', '1. Your documents').should('be.visible');
			UploadDocumentsActions.openTask(index);
			cy.url().should('include', fragment);
			cy.contains('This category contains 0 documents.').should('be.visible');
		});
	};

	const selectFirstDocumentType = () => {
		cy.contains('h1', 'Select the document type').should('be.visible');
		UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
		clickContinue();
	};

	const uploadFile = () => {
		cy.contains('h1', 'Upload your documents').should('be.visible');
		cy.url().should('include', urlFor('/upload/upload-documents'));
		// Selecting a file auto-submits its own form to the /upload endpoint and the server then
		// redirects back to this page; wait for the request AND the resulting reload to land
		// (the govuk-frontend status text updates client-side before either completes).
		cy.intercept('POST', '**/upload').as('fileUpload');
		cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });
		cy.wait('@fileUpload');
		cy.get('.govuk-summary-list').should('contain', 'uploadTest.pdf');
		clickContinue();
	};

	const selectRegulation = () => {
		cy.contains('h1', 'Select the relevant APFP regulation').should('be.visible');
		cy.url().should('include', urlFor('/upload/regulation'));
		UploadDocumentsLocators.apfpRegulationTextbox().type('5');
		cy.get('.autocomplete__option').first().click();
		clickContinue();
	};

	const selectCertifiedYes = () => {
		cy.contains('h1', 'Will the document be certified in the draft development consent order (DCO)?').should(
			'be.visible'
		);
		cy.url().should('include', urlFor('/upload/document-certified'));
		UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
		clickContinue();
	};

	it(`uploads and commits a document for ${name}`, () => {
		openCategory();
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', urlFor('/upload/document-type'));
		selectFirstDocumentType();
		uploadFile();
		selectRegulation();
		selectCertifiedYes();

		cy.contains('h1', 'Check your answers before uploading your documents').should('be.visible');
		cy.url().should('include', urlFor('/check-your-answers'));
		cy.get('.govuk-summary-list div').should('have.length', 4);
		cy.get('.govuk-summary-list div').eq(1).find('dd').should('contain.text', 'uploadTest.pdf');
		cy.get('.govuk-summary-list div').eq(2).find('dd').should('contain.text', '5');
		cy.get('.govuk-summary-list div').eq(3).find('dd').should('contain.text', 'Yes');

		clickContinue();
		cy.url().should('include', fragment);
		cy.contains('uploadTest.pdf').should('be.visible');
	});
};

describe('Document upload journeys', () => {
	DOCUMENT_CATEGORIES.forEach(documentUploadJourneyTests);
});
