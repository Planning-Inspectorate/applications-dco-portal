/// <reference types="cypress" />
import QuestionnaireActions from '../../page_object/PageAction/questionnaireActions.js';
import QuestionnaireLocators from '../../page_object/PageLocators/questionnaireLocators.js';
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';

describe('Applicant Details - No Agent', () => {
	it('completes applicant details journey without an agent', () => {
		QuestionnaireActions.fillApplicantDetails(false);
	});

	it('validates required fields on organization and name', () => {
		QuestionnaireActions.openApplicantDetails();
		QuestionnaireLocators.applicantOrgInput().clear();
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains(/Enter the applicant.*organisation/i).should('be.visible');
	});
});
