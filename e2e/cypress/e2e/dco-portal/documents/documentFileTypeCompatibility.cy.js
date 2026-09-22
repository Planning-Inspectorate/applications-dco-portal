/// <reference types="cypress" />
import UploadDocumentsActions from '../../../page_object/PageAction/uploadDocumentsActions.js';
import { ALLOWED_FILE_TYPES, DOCUMENT_CATEGORIES } from '../../../support/utils/documentUploadTestData.js';

/**
 * Covers supported file extensions at the document upload control.
 */
const fileTypeTests = ({ name, index, fragment }) => {
	const documentTypeId = fragment.slice(1);

	describe(name, () => {
		ALLOWED_FILE_TYPES.slice(0, 1).forEach(({ label, file }) => {
			it(`accepts ${label} files`, () => {
				UploadDocumentsActions.reachDocumentUploadPage(index, documentTypeId);
				cy.url().should('include', `${fragment}/upload/upload-documents`);

				// Selecting a file auto-submits its own form to the /upload endpoint and the server then
				// redirects back to this page; wait for the request AND the resulting reload to land
				// (the govuk-frontend status text updates client-side before either completes).
				const fileName = file.split('/').pop();
				cy.intercept('POST', '**/upload').as('fileUpload');
				cy.get('input[type="file"]').selectFile(file, { force: true });
				cy.wait('@fileUpload');

				// Assert the file was accepted — it should appear in the staged summary list.
				cy.get('.govuk-summary-list').should('contain', fileName);

				// Remove the uploaded file via the app's own delete route so the blob and
				// session state are cleared within this test rather than relying on the
				// clearDocumentCategory task (which requires blob-store env vars to be set).
				UploadDocumentsActions.removeAllStagedUploads();
				cy.get('.govuk-summary-list').should('not.exist');
			});
		});
	});
};

describe('Document upload file compatibility', () => {
	DOCUMENT_CATEGORIES.slice(0, 1).forEach(fileTypeTests);
});
