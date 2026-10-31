import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import SubmissionLocators from '../PageLocators/submissionLocators.js';

class SubmissionActions {
	navigateToDeclaration() {
		CommonActions.login();
		cy.visit('/declaration/name');
		cy.url().should('include', '/declaration/name');
	}

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

	submitDeclaration() {
		SubmissionLocators.confirmationCheckbox().check({ force: true });
		SubmissionLocators.submitButton().click();
		cy.url().should('include', '/application-complete');
		SubmissionLocators.completePanel().should('contain.text', 'Application complete');
	}
}

export default new SubmissionActions();
