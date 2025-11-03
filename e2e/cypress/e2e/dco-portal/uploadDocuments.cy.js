/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

describe('1. Your documents', () => {
	describe('Application form related information', () => {
		it('Standard journey', () => {
			CommonActions.login();
			cy.get('h1').should('be.visible').contains('Application reference number');
			cy.get('h2').should('be.visible').contains('Your documents');

			//open first task
			UploadDocumentsActions.openTask(0);
			cy.url().should('include', '/application-form-related-information');
			cy.get('p').contains('This category contains 0 document(s)').should('be.visible');

			//document upload process
			UploadDocumentsLocators.uploadDocumentsButton().click();
			//documentType
			cy.url().should('include', '/application-form-related-information/upload/document-type');
			cy.get('h1').contains('Select the document type').should('be.visible');
			UploadDocumentsLocators.getDocumentTypeRadioButtonByValue('guide-to-the-application').check();
			CommonLocators.saveAndContinueButton().click();

			//fileUpload
			cy.get('h1').contains('Upload your documents').should('be.visible');
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
			CommonLocators.saveAndContinueButton().click();

			//apfpRegulation
			cy.get('h1').contains('Select the relevant APFP regulation').should('be.visible');
			cy.url().should('include', '/application-form-related-information/upload/regulation');
			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').should('be.visible').first().click();
			CommonLocators.saveAndContinueButton().click();

			//isCertified
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

			/*
			Need to enforce the redirect and normal behaviour after submitting without persisting to the database. You could stub it?
	
			cy.get('.govuk-button').contains('Confirm upload').click();
			cy.get('input[name="applicationFormRelatedInformationIsCompleted"][value="yes"]').click();
			cy.get('button[data-module="govuk-button"]').click();
			*/
		});
		it('Required input validation', () => {
			CommonActions.login();
			UploadDocumentsActions.openTask(0);
			cy.url().should('include', '/application-form-related-information');
			cy.get('p').contains('This category contains 0 document(s)').should('be.visible');

			//document upload process
			UploadDocumentsLocators.uploadDocumentsButton().click();
			//documentType
			cy.url().should('include', '/application-form-related-information/upload/document-type');
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
			UploadDocumentsLocators.getDocumentTypeRadioButtonByValue('guide-to-the-application').check();
			CommonLocators.saveAndContinueButton().click();

			//fileUpload
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('Upload an attachment');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
			CommonLocators.saveAndContinueButton().click();

			//apfpRegulation
			cy.url().should('include', '/application-form-related-information/upload/regulation');
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').should('be.visible').first().click();
			CommonLocators.saveAndContinueButton().click();

			//isCertified
			cy.url().should('include', '/application-form-related-information/upload/document-certified');
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
		});
		it('Uploaded file type validation', () => {
			UploadDocumentsActions.reachDocumentUploadPage();

			//fileUpload
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			//invalid file type should fail
			cy.get('input[type="file"]').selectFile('cypress/fixtures/invalidFileType.txt', { force: true });
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('The attachment must be PDF, PNG, DOC, DOCX, JPG, JPEG, TIF, TIFF, XLS or XLSX');
		});
	});
	describe('Allowed file type coverage for upload', () => {
		it('PDF', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('PNG', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.png', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('JPG', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.jpg', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('JPEG', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.jpeg', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('DOCX', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.docx', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('DOC', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.doc', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('XLSX', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.xlsx', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('XLS', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.xls', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('TIFF', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.tiff', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
		it('TIF', () => {
			UploadDocumentsActions.reachDocumentUploadPage();
			cy.url().should('include', '/application-form-related-information/upload/upload-documents');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.tif', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', '/application-form-related-information/upload/regulation');
		});
	});
});
