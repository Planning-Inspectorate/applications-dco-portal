/// <reference types="cypress" />

Cypress.Commands.add('deleteDownloads', () => {
	cy.task('DeleteDownloads');
});

Cypress.Commands.add('deleteUnwantedFixtures', () => {
	cy.task('DeleteUnwantedFixtures');
});

Cypress.Commands.add('validateDownloadedFile', (fileName) => {
	cy.task('ValidateDownloadedFile', fileName).then((success) => {
		if (success) {
			expect(success).to.be.true;
		} else {
			throw new Error(`${fileName} was not found. The file was either not downloaded or the file name is not correct.`);
		}
	});
});

Cypress.Commands.add('getByData', (value) => {
	return cy.get(`[data-cy="${value}"]`);
});
