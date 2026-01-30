/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

const DEFAULT_UPLOAD = 'cypress/fixtures/uploadTest.pdf';

const TASKS = [
	{ name: 'Application form related information', index: 0, fragment: '/application-form-related-information' },
	{ name: 'Plans and drawings', index: 1, fragment: '/plans-and-drawings' },
	{ name: 'Draft DCO', index: 2, fragment: '/draft-dco' },
	{ name: 'Compulsory acquisition information', index: 3, fragment: '/compulsory-acquisition-information' },
	{ name: 'Consultation report', index: 4, fragment: '/consultation-report' }
];

const ALLOWED_FILE_TYPES = [
	{ label: 'PDF', file: 'cypress/fixtures/uploadTest.pdf' },
	{ label: 'PNG', file: 'cypress/fixtures/uploadTest.png' },
	{ label: 'JPG', file: 'cypress/fixtures/uploadTest.jpg' },
	{ label: 'JPEG', file: 'cypress/fixtures/uploadTest.jpeg' },
	{ label: 'DOCX', file: 'cypress/fixtures/uploadTest.docx' },
	{ label: 'DOC', file: 'cypress/fixtures/uploadTest.doc' },
	{ label: 'XLSX', file: 'cypress/fixtures/uploadTest.xlsx' },
	{ label: 'XLS', file: 'cypress/fixtures/uploadTest.xls' },
	{ label: 'TIFF', file: 'cypress/fixtures/uploadTest.tiff' },
	{ label: 'TIF', file: 'cypress/fixtures/uploadTest.tif' }
];

const documentUploadJourneyTests = (taskName, taskIndex, urlFragment, fileToUpload = DEFAULT_UPLOAD) => {
	const urlFor = (path) => `${urlFragment}${path}`;
	const clickContinue = () => CommonLocators.saveAndContinueButton().click();

	const assertErrorSummary = () => {
		cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
	};

	const openCategory = () => {
		const testReference = Cypress.env('TEST_APPLICATION_REFERENCE');
		CommonActions.login();
		cy.contains('h1', testReference).should('be.visible');
		cy.contains('h2', 'Your documents').should('be.visible');
		UploadDocumentsActions.openTask(taskIndex);
		cy.url().should('include', urlFragment);
		cy.contains('This category contains 0 document(s)').should('be.visible');
	};

	const startUpload = () => {
		UploadDocumentsLocators.uploadDocumentsButton().click();
		cy.url().should('include', urlFor('/upload/document-type'));
	};

	const selectFirstDocumentType = () => {
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
		clickContinue();
	};

	const uploadFile = (file) => {
		cy.contains('h1', 'Upload your documents').should('be.visible');
		cy.url().should('include', urlFor('/upload/upload-documents'));
		cy.get('input[type="file"]').selectFile(file, { force: true });
		clickContinue();
	};

	const selectRegulation = (value = '5') => {
		cy.contains('h1', 'Select the relevant APFP regulation').should('be.visible');
		cy.url().should('include', urlFor('/upload/regulation'));
		UploadDocumentsLocators.apfpRegulationTextbox().type(value);
		cy.get('.autocomplete__option').first().click();
		clickContinue();
	};

	const selectCertifiedYes = () => {
		cy.contains('h1', 'Is the document certified?').should('be.visible');
		cy.url().should('include', urlFor('/upload/document-certified'));
		UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
		clickContinue();
	};

	const assertCheckYourAnswers = () => {
		cy.contains('h1', 'Check your answers before uploading your document(s)');
		cy.url().should('include', urlFor('/check-your-answers'));

		cy.get('.govuk-summary-list div').should('have.length', 4);

		cy.get('@selectedDocumentType').then((type) => {
			cy.get('.govuk-summary-list div').eq(0).find('dd').contains(type);
		});

		cy.get('.govuk-summary-list div').eq(1).find('dd').contains('uploadTest.pdf');
		cy.get('.govuk-summary-list div').eq(2).find('dd').contains('5');
		cy.get('.govuk-summary-list div').eq(3).find('dd').contains('Yes');
	};

	const continueAndAssertError = (message) => {
		clickContinue();
		assertErrorSummary();
		cy.contains('a', message);
	};

	describe(taskName, () => {
		it('Standard journey', () => {
			openCategory();
			startUpload();
			selectFirstDocumentType();
			uploadFile(fileToUpload);
			selectRegulation();
			selectCertifiedYes();
			assertCheckYourAnswers();
		});

		it('Required input validation', () => {
			openCategory();
			startUpload();

			continueAndAssertError('You must select an answer');
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			clickContinue();

			continueAndAssertError('Upload an attachment');
			cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });
			clickContinue();

			continueAndAssertError('You must select an answer');
			selectRegulation();

			continueAndAssertError('You must select an answer');
		});

		it('Uploaded file type validation', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', urlFor('/upload/upload-documents'));

			cy.get('input[type="file"]').selectFile('cypress/fixtures/invalidFileType.txt', { force: true });

			assertErrorSummary();
			cy.contains(
				'The attachment must be PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, XLSM, MSG, JPG, JPEG, MPEG, MP3, MP4, MOV, PNG, TIF, TIFF, DBF, HTML, PRJ, SHP, SHX, or GIS'
			);
		});
	});

	describe('Allowed file type coverage for upload', () => {
		ALLOWED_FILE_TYPES.forEach(({ label, file }) => {
			it(label, () => {
				UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
				cy.url().should('include', urlFor('/upload/upload-documents'));

				cy.get('input[type="file"]').selectFile(file, { force: true });
				clickContinue();

				cy.url().should('include', urlFor('/upload/regulation'));
			});
		});
	});
};

describe('1. Your documents', () => {
	TASKS.forEach(({ name, index, fragment }) => documentUploadJourneyTests(name, index, fragment));
});
