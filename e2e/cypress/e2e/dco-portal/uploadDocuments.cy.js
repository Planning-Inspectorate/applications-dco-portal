/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

describe('1. Your documents', () => {
	it('Application form related information journey', () => {
		CommonActions.login();
		cy.get('h1').should('be.visible').contains('Application reference number');
		cy.get('h2').should('be.visible').contains('Your documents');

		//open first task
		UploadDocumentsActions.openTask(0);
		cy.url().should('include', '/application-form-related-information');
		cy.get('p').contains('This category contains 0 document(s).');

		//document upload process
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', '/application-form-related-information/upload/document-type');
		cy.get('h1').contains('Select the document type');
		UploadDocumentsLocators.getDocumentTypeRadioButtonByValue('guide-to-the-application').check();
		CommonLocators.saveAndContinueButton().click();
		cy.get('h1').contains('Select the relevant APFP regulation');
		cy.url().should('include', '/application-form-related-information/upload/regulation');
		UploadDocumentsLocators.apfpRegulationTextbox().type('5');
		cy.get('.autocomplete__option').should('be.visible').first().click();
		CommonLocators.saveAndContinueButton().click();
	});
});
