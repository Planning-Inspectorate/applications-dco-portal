/**
 * @file End-to-end tests for document taxonomy, uploads, file types, and duplicate prevention.
 * @module e2e/dco-portal/uploadDocuments
 *
 * This test suite validates document subcategory listings, file uploads, allowed extensions, and duplicate prevention.
 */

/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

/**
 * Standard test PDF file used for document upload tests.
 */
const DEFAULT_UPLOAD = 'cypress/fixtures/uploadTest.pdf';

/**
 * Statutory document categories defined for the DCO application.
 */
const TASKS = [
	{ name: 'Application form related information', index: 0, fragment: '/application-form-related-information' },
	{ name: 'Plans and drawings', index: 1, fragment: '/plans-and-drawings' },
	{ name: 'Draft development consent order (DCO)', index: 2, fragment: '/draft-dco' },
	{ name: 'Compulsory acquisition information', index: 3, fragment: '/compulsory-acquisition-information' },
	{ name: 'Newspaper notices', index: 4, fragment: '/newspaper-notices' },
	{ name: 'Reports and statements', index: 5, fragment: '/reports-and-statements' },
	{ name: 'Environmental statement', index: 6, fragment: '/environmental-statement' },
	{ name: 'Additional prescribed information', index: 7, fragment: '/additional-prescribed-information' },
	{ name: 'Other documents', index: 8, fragment: '/other-documents' }
];

/**
 * Permitted file formats accepted by the document upload service.
 */
const ALLOWED_FILE_TYPES = [
	{ label: 'PDF', file: 'cypress/fixtures/uploadTest.pdf' },
	{ label: 'PNG', file: 'cypress/fixtures/uploadTest.png' },
	{ label: 'JPG', file: 'cypress/fixtures/uploadTest.jpg' },
	{ label: 'JPEG', file: 'cypress/fixtures/uploadTest.jpeg' },
	{ label: 'DOCX', file: 'cypress/fixtures/uploadTest.docx' },
	{ label: 'XLSX', file: 'cypress/fixtures/uploadTest.xlsx' },
	{ label: 'XLS', file: 'cypress/fixtures/uploadTest.xls' },
	{ label: 'TIFF', file: 'cypress/fixtures/uploadTest.tiff' },
	{ label: 'TIF', file: 'cypress/fixtures/uploadTest.tif' }
];

describe('1. Your documents', () => {
	before(() => {
		cy.task('resetCase', { reference: Cypress.env('TEST_APPLICATION_REFERENCE') });
		CommonActions.login();
	});

	/**
	 * Verifies that each document category renders all statutory subcategories from the taxonomy fixture.
	 */
	describe('Subcategory Taxonomy Verification', () => {
		it('verifies all categories display their statutory subcategories', () => {
			cy.fixture('document-taxonomy.json').then((taxonomy) => {
				taxonomy.forEach((cat) => {
					CommonActions.login();
					UploadDocumentsActions.openTask(cat.id);
					cy.url().should('include', cat.id);
					UploadDocumentsLocators.uploadDocumentsButton().click();
					cy.url().should('include', '/upload/document-type');

					cat.subcategories.forEach((subcat) => {
						cy.contains('label', subcat).should('exist');
					});
				});
			});
		});
	});

	/**
	 * Verifies successful upload flow and input validation across all nine statutory categories.
	 */
	describe('Document Upload Journeys', () => {
		TASKS.forEach(({ name, index, fragment }) => {
			describe(name, () => {
				const categoryId = fragment.replace(/^\//, '');

				beforeEach(() => {
					cy.task('clearDocumentCategory', {
						documentTypeId: categoryId,
						reference: Cypress.env('TEST_APPLICATION_REFERENCE')
					});
				});

				/**
				 * Verifies complete upload flow from subcategory choice to table confirmation.
				 */
				it('completes upload journey with document persistence', () => {
					UploadDocumentsActions.openCategory(index, fragment);
					cy.contains('This category contains 0 documents').should('be.visible');
					UploadDocumentsActions.startUpload(fragment);
					UploadDocumentsActions.selectFirstDocumentType();
					UploadDocumentsActions.uploadFile(DEFAULT_UPLOAD, fragment);
					UploadDocumentsActions.selectRegulation('5', fragment);
					UploadDocumentsActions.selectCertifiedYes(fragment);
					UploadDocumentsActions.assertCheckYourAnswers(fragment);
					UploadDocumentsActions.confirmUploadAndVerify(fragment, 'uploadTest.pdf');
				});

				/**
				 * Verifies mandatory validation messages for all upload fields.
				 */
				it('validates required inputs across upload steps', () => {
					UploadDocumentsActions.openCategory(index, fragment);
					UploadDocumentsActions.startUpload(fragment);

					UploadDocumentsActions.continueAndAssertError('Select the document type');
					UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
					CommonLocators.saveAndContinueButton().click();

					UploadDocumentsActions.continueAndAssertError('Select a file to upload');
					UploadDocumentsActions.uploadFile(DEFAULT_UPLOAD, fragment);

					UploadDocumentsActions.continueAndAssertError('Select the APFP regulation');
					UploadDocumentsActions.selectRegulation('5', fragment);

					UploadDocumentsActions.continueAndAssertError('Select yes if the document is certified');
				});
			});
		});
	});

	/**
	 * Verifies accepted document extensions and rejection of invalid file types.
	 */
	describe('Allowed file type coverage', () => {
		const taskIndex = 0;
		const urlFragment = '/application-form-related-information';

		ALLOWED_FILE_TYPES.forEach(({ label, file }) => {
			it(`accepts valid file type: ${label}`, () => {
				UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
				cy.url().should('include', `${urlFragment}/upload/upload-documents`);
				cy.get('input[type="file"]').selectFile(file, { force: true });
				// eslint-disable-next-line cypress/no-unnecessary-waiting
				cy.wait(500);
				CommonLocators.saveAndContinueButton().click();
				cy.url().should('include', `${urlFragment}/upload/regulation`);
			});
		});

		it('rejects invalid file type (.txt)', () => {
			UploadDocumentsActions.reachDocumentUploadPage(taskIndex);
			cy.url().should('include', `${urlFragment}/upload/upload-documents`);
			cy.get('input[type="file"]').selectFile('cypress/fixtures/invalidFileType.txt', { force: true });
			cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
			cy.contains(
				'Each file must be a PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, XLSM, MSG, JPG, JPEG, MPEG, MP3, MP4, MOV, PNG, TIF, TIFF, DBF, HTML, PRJ, SHP, SHX, or GIS'
			);
		});
	});

	/**
	 * Verifies that uploading a duplicate file name in the same subcategory displays an error.
	 */
	describe('Duplicate Upload Prevention', () => {
		const taskIndex = 0;
		const fragment = '/application-form-related-information';
		const categoryId = 'application-form-related-information';

		beforeEach(() => {
			cy.task('clearDocumentCategory', {
				documentTypeId: categoryId,
				reference: Cypress.env('TEST_APPLICATION_REFERENCE')
			});
		});

		it('prevents uploading identical file name in same subcategory', () => {
			CommonActions.login();
			UploadDocumentsActions.openTask(taskIndex);
			UploadDocumentsLocators.uploadDocumentsButton().click();
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			CommonLocators.saveAndContinueButton().click();

			cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(500);
			cy.get('.govuk-summary-list__row').should('contain.text', 'uploadTest.pdf');
			CommonLocators.saveAndContinueButton().click();

			UploadDocumentsLocators.apfpRegulationTextbox().type('5');
			cy.get('.autocomplete__option').first().click();
			CommonLocators.saveAndContinueButton().click();

			UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
			CommonLocators.saveAndContinueButton().click();

			UploadDocumentsActions.confirmUploadAndVerify(fragment, 'uploadTest.pdf');

			// Attempt duplicate upload
			UploadDocumentsLocators.uploadDocumentsButton().click();
			UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
			CommonLocators.saveAndContinueButton().click();

			cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });

			cy.get('.govuk-error-summary').should('be.visible');
			cy.contains('You’ve already uploaded uploadTest.pdf. Upload a file with a different name.');
		});
	});
});
