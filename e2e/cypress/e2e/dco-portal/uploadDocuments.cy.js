/// <reference types="cypress" />
import CommonActions from '../../page_object/PageAction/commonActions.js';
import UploadDocumentsActions from '../../page_object/PageAction/uploadDocumentsActions.js';
import UploadDocumentsLocators from '../../page_object/PageLocators/uploadDocumentsLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

const DEFAULT_UPLOAD = 'cypress/fixtures/uploadTest.pdf';

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

	describe('Document Upload Journeys', () => {
		TASKS.forEach(({ name, index, fragment }) => {
			describe(name, () => {
				const categoryId = fragment.replace(/^\//, '');
				const urlFor = (path) => `${fragment}${path}`;
				const clickContinue = () => CommonLocators.saveAndContinueButton().click();

				const assertErrorSummary = () => {
					cy.get('.govuk-error-summary__title').should('be.visible').contains('There is a problem');
				};

				const openCategory = () => {
					CommonActions.login();
					cy.contains('h2', 'Your documents').should('be.visible');
					UploadDocumentsActions.openTask(index);
					cy.url().should('include', fragment);
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
					// eslint-disable-next-line cypress/no-unnecessary-waiting
					cy.wait(500);
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
					cy.contains('h1', /Will the document be certified/i).should('be.visible');
					cy.url().should('include', urlFor('/upload/document-certified'));
					UploadDocumentsLocators.certifiedDocumentYesRadioButton().check();
					clickContinue();
				};

				const assertCheckYourAnswers = () => {
					cy.contains('h1', /Check your answers before uploading your document/i).should('be.visible');
					cy.url().should('include', urlFor('/check-your-answers'));
					cy.get('.govuk-summary-list').should('be.visible');
					cy.get('@selectedDocumentType').then((type) => {
						cy.get('.govuk-summary-list').contains(type);
					});
					cy.get('.govuk-summary-list').contains('uploadTest.pdf');
					cy.get('.govuk-summary-list').contains('5');
					cy.get('.govuk-summary-list').contains('Yes');
				};

				const continueAndAssertError = (message) => {
					clickContinue();
					assertErrorSummary();
					cy.contains('a', message);
				};

				beforeEach(() => {
					cy.task('clearDocumentCategory', {
						documentTypeId: categoryId,
						reference: Cypress.env('TEST_APPLICATION_REFERENCE')
					});
				});

				it('completes upload journey with document persistence', () => {
					openCategory();
					cy.contains('This category contains 0 documents').should('be.visible');
					startUpload();
					selectFirstDocumentType();
					uploadFile(DEFAULT_UPLOAD);
					selectRegulation();
					selectCertifiedYes();
					assertCheckYourAnswers();
					UploadDocumentsActions.confirmUploadAndVerify(fragment, 'uploadTest.pdf');
				});

				it('validates required inputs across upload steps', () => {
					openCategory();
					startUpload();

					continueAndAssertError('Select the document type');
					UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
					clickContinue();

					continueAndAssertError('Select a file to upload');
					cy.get('input[type="file"]').selectFile(DEFAULT_UPLOAD, { force: true });
					// eslint-disable-next-line cypress/no-unnecessary-waiting
					cy.wait(500);
					clickContinue();

					continueAndAssertError('Select the APFP regulation');
					selectRegulation();

					continueAndAssertError('Select yes if the document is certified');
				});
			});
		});
	});

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
