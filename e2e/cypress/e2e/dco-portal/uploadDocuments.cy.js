/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

describe('1. Your documents', () => {
	documentUploadJourneyTests('Application form related information', 0, '/application-form-related-information');
	documentUploadJourneyTests('Plans and drawings', 1, '/plans-and-drawings');
	documentUploadJourneyTests('Draft DCO', 2, '/draft-dco');
	documentUploadJourneyTests('Compulsory acquisition information', 3, '/compulsory-acquisition-information');
	documentUploadJourneyTests('Consultation report', 4, '/consultation-report');
});

function documentUploadJourneyTests(
	taskName,
	taskIndex,
	urlFragment,
	fileToUpload = 'cypress/fixtures/uploadTest.pdf'
) {
	describe(taskName, () => {
		it('Standard journey', () => {
			CommonActions.login();
			cy.get('h1').should('be.visible').contains('Application reference number');
			cy.get('h2').should('be.visible').contains('Your documents');

			//open first task
			UploadDocumentsActions.openTask(taskIndex);
			cy.url().should('include', urlFragment);
			cy.get('p').contains('This category contains 0 document(s)').should('be.visible');

			//document upload process
			UploadDocumentsLocators.uploadDocumentsButton().click();
			//documentType
			cy.url().should('include', `${urlFragment}/upload/document-type`);
			cy.get('h1').contains('Select the document type').should('be.visible');
			UploadDocumentsLocators.getDocumentTypeRadioButtons()
				.eq(0)
				.invoke('attr', 'id')
				.then((id) => {
					cy.get(`label[for="${id}"]`)
						.invoke('text')
						.then((text) => {
							cy.wrap(text.trim()).as('selectedDocumentType');
						});
				});
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			CommonLocators.saveAndContinueButton().click();

			//fileUpload
			cy.get('h1').contains('Upload your documents').should('be.visible');
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile(fileToUpload, { force: true });
			CommonLocators.saveAndContinueButton().click();

			//apfpRegulation
			cy.get('h1').contains('Select the relevant APFP regulation').should('be.visible');
			cy.url().should('include', `${urlFragment}/upload/regulation`);
			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').should('be.visible').first().click();
			CommonLocators.saveAndContinueButton().click();

			//isCertified
			cy.get('h1').contains('Is the document certified?').should('be.visible');
			cy.url().should('include', `${urlFragment}/upload/document-certified`);
			UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
			CommonLocators.saveAndContinueButton().click();

			cy.get('h1').contains('Check your answers before uploading your document(s)');
			cy.url().should('include', `${urlFragment}/check-your-answers`);
			cy.get('.govuk-summary-list').find('div').should('have.length', 4);
			cy.get('@selectedDocumentType').then((selectedDocumentType) => {
				cy.get('.govuk-summary-list')
					.children('div')
					.eq(0)
					.find('dd')
					.contains(selectedDocumentType)
					.should('be.visible');
			});
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
			UploadDocumentsActions.openTask(taskIndex);
			cy.url().should('include', urlFragment);
			cy.get('p').contains('This category contains 0 document(s)').should('be.visible');

			//document upload process
			UploadDocumentsLocators.uploadDocumentsButton().click();
			//documentType
			cy.url().should('include', `${urlFragment}/upload/document-type`);
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			CommonLocators.saveAndContinueButton().click();

			//fileUpload
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('Upload an attachment');
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
			CommonLocators.saveAndContinueButton().click();

			//apfpRegulation
			cy.url().should('include', `${urlFragment}/upload/regulation`);
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').should('be.visible').first().click();
			CommonLocators.saveAndContinueButton().click();

			//isCertified
			cy.url().should('include', `${urlFragment}/upload/document-certified`);
			CommonLocators.saveAndContinueButton().click();
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('You must select an answer');
		});
		it('Uploaded file type validation', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);

			//fileUpload
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			//invalid file type should fail
			cy.get('input[type="file"]').selectFile('cypress/fixtures/invalidFileType.txt', { force: true });
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.get('a').contains('The attachment must be PDF, PNG, DOC, DOCX, JPG, JPEG, TIF, TIFF, XLS or XLSX');
		});
	});
	describe('Allowed file type coverage for upload', () => {
		it('PDF', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.pdf', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('PNG', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.png', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('JPG', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.jpg', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('JPEG', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.jpeg', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('DOCX', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.docx', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('DOC', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.doc', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('XLSX', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.xlsx', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('XLS', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.xls', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('TIFF', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.tiff', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
		it('TIF', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/uploadTest.tif', { force: true });
			CommonLocators.saveAndContinueButton().click();
			cy.url().should('include', `${urlFragment}/upload/regulation`);
		});
	});
}
