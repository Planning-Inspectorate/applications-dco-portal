/**
 * @file End-to-end tests for applicant and agent contact information workflows.
 * @module e2e/dco-portal/applicantDetails
 *
 * This test suite validates direct applicant submissions, agent representations, and required input validations.
 */

/// <reference types="cypress" />
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';
import QuestionnaireActions from '../../page_object/PageAction/questionnaireActions.js';
import QuestionnaireLocators from '../../page_object/PageLocators/questionnaireLocators.js';

describe('Applicant Details Journey', () => {
	/**
	 * Verifies completing applicant details when no agent represents the applicant.
	 */
	it('completes applicant details journey without an agent', () => {
		QuestionnaireActions.fillApplicantDetails(false);
	});

	/**
	 * Verifies completing applicant details when an authorised agent represents the applicant.
	 */
	it('completes applicant details journey with an authorized agent', () => {
		QuestionnaireActions.fillApplicantDetails(true);
	});

	/**
	 * Verifies that mandatory organisation input validation shows an error when left empty.
	 */
	it('validates required fields on organization and name', () => {
		QuestionnaireActions.openApplicantDetails();
		QuestionnaireLocators.applicantOrgInput().clear();
		CommonLocators.saveAndContinueButton().click();
		QuestionnaireActions.assertValidationError(/Enter the applicant.*organisation/i);
	});
});
