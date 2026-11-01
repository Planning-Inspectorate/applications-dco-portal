/// <reference types="cypress" />
import SubmissionActions from '../../page_object/PageAction/submissionActions.js';
import SubmissionLocators from '../../page_object/PageLocators/submissionLocators.js';

describe('Statutory Declaration & Submission', () => {
	beforeEach(() => {
		cy.task('setupCaseForSubmission', {
			reference: Cypress.env('TEST_APPLICATION_REFERENCE')
		});
	});

	afterEach(() => {
		cy.task('resetCase', { reference: Cypress.env('TEST_APPLICATION_REFERENCE') });
		cy.visit('/sign-out', { failOnStatusCode: false });
		cy.clearCookies();
		cy.clearAllSessionStorage();
		Cypress.session.clearAllSavedSessions();
	});

	it('enforces declaration confirmation checkbox acceptance', () => {
		SubmissionActions.fillDeclarationDetails();
		cy.url().should('include', '/declaration');

		// Submit without checking confirmation checkbox
		SubmissionLocators.submitButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('You must confirm you understand and accept the declaration').should('be.visible');
	});

	it('completes statutory declaration and final submission to reach completion', () => {
		SubmissionActions.fillDeclarationDetails('Jane', 'Doe', 'Infrastructure Consultants Ltd', 'Lead Planning Director');
		SubmissionActions.submitDeclaration();

		SubmissionLocators.completePanel().should('be.visible');
		cy.contains('What happens next').should('be.visible');
		cy.contains(Cypress.env('TEST_APPLICATION_REFERENCE')).should('be.visible');
	});
});
