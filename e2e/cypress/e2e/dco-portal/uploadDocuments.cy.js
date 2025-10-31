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
		cy.get('p').contains('This category contains').should('be.visible');

		//document upload process
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', '/application-form-related-information/upload/document-type');
		cy.get('h1').contains('Select the document type').should('be.visible');
		UploadDocumentsLocators.getDocumentTypeRadioButtonByValue('guide-to-the-application').check();
		CommonLocators.saveAndContinueButton().click();

		cy.get('h1').contains('Upload your documents').should('be.visible');
		cy.url().should('include', '/application-form-related-information/upload/upload-documents');
		cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
		CommonLocators.saveAndContinueButton().click();

		cy.get('h1').contains('Select the relevant APFP regulation').should('be.visible');
		cy.url().should('include', '/application-form-related-information/upload/regulation');
		UploadDocumentsLocators.apfpRegulationTextbox().type('5');
		cy.get('.autocomplete__option').should('be.visible').first().click();
		CommonLocators.saveAndContinueButton().click();

		cy.get('h1').contains('Is the document certified?').should('be.visible');
		cy.url().should('include', '/application-form-related-information/upload/document-certified');
		UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
		CommonLocators.saveAndContinueButton().click();

		cy.get('h1').contains('Check your answers before uploading your document(s)');
		cy.url().should('include', '/application-form-related-information/check-your-answers');
		cy.get('.govuk-summary-list').find('div').should('have.length', 4);
		cy.get('.govuk-summary-list')
			.children('div')
			.eq(0)
			.find('dd')
			.contains('Guide to the Application')
			.should('be.visible');
		cy.get('.govuk-summary-list').children('div').eq(1).find('dd').contains('uploadTest.pdf').should('be.visible');
		cy.get('.govuk-summary-list').children('div').eq(2).find('dd').contains('5').should('be.visible');
		cy.get('.govuk-summary-list').children('div').eq(3).find('dd').contains('Yes').should('be.visible');

		cy.get('.govuk-button').contains('Confirm upload').click();
		cy.get('input[name="applicationFormRelatedInformationIsCompleted"][value="yes"]').click();
		cy.get('button[data-module="govuk-button"]').click();
	});
});
