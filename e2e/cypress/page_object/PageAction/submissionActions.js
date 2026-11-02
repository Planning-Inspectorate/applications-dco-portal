/**
 * @file User actions for statutory declaration and application submission.
 * @module page_object/PageAction/submissionActions
 *
 * This class provides actions for submitting the final statutory declaration and completing the application.
 */

import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import SubmissionLocators from '../PageLocators/submissionLocators.js';

/**
 * Encapsulates actions for the statutory declaration and final submission.
 */
class SubmissionActions {
	/**
	 * Navigates to the statutory declaration details page after login.
	 *
	 * @returns {void}
	 */
	navigateToDeclaration() {
		CommonActions.login();
		cy.visit('/declaration/name');
		cy.url().should('include', '/declaration/name');
	}

	/**
	 * Fills all declaration information steps for the submitting representative.
	 *
	 * @param {string} [firstName='Test'] - First name of the declarant.
	 * @param {string} [lastName='Submitter'] - Last name of the declarant.
	 * @param {string} [org='Planning Authority'] - Declarant organisation name.
	 * @param {string} [position='Director'] - Declarant role or title.
	 * @returns {void}
	 */
	fillDeclarationDetails(
		firstName = 'Test',
		lastName = 'Submitter',
		org = 'Planning Authority',
		position = 'Director'
	) {
		this.navigateToDeclaration();

		SubmissionLocators.firstNameInput().clear().type(firstName);
		SubmissionLocators.lastNameInput().clear().type(lastName);
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/declaration/organisation');
		SubmissionLocators.orgInput().clear().type(org);
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/declaration/position-in-organisation');
		SubmissionLocators.positionInput().clear().type(position);
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/declaration');
	}

	/**
	 * Accepts the statutory declaration checkbox and submits the application.
	 *
	 * @returns {void}
	 */
	submitDeclaration() {
		SubmissionLocators.confirmationCheckbox().check({ force: true });
		SubmissionLocators.submitButton().click();
		cy.url().should('include', '/application-complete');
		SubmissionLocators.completePanel().should('contain.text', 'Application complete');
	}
}

export default new SubmissionActions();
