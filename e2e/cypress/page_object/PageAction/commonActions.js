import commonLocators from '../PageLocators/commonLocators';
import loginPageLocators from '../PageLocators/loginPageLocators';
import loginPageActions from './loginPageActions';
class CommonActions {
	login() {
		cy.log(`TEST_TOOLS_TOKEN present: ${!!Cypress.env('TEST_TOOLS_TOKEN')}`);
		cy.request({
			method: 'POST',
			url: '/login/test/setup-case',
			headers: {
				'x-test-tools-token': Cypress.env('TEST_TOOLS_TOKEN')
			},
			body: {
				emailAddress: Cypress.env('USER_EMAIL'),
				caseReference: Cypress.env('TEST_APPLICATION_REFERENCE')
			}
		});

		cy.visit('/login/sign-in');

		loginPageActions.signInWithCredentials(Cypress.env('USER_EMAIL'), Cypress.env('TEST_APPLICATION_REFERENCE'));

		cy.url().should('include', '/enter-code');

		loginPageLocators.otpCodeInput().type('ABCDE');
		commonLocators.saveAndContinueButton().click();
	}
}
export default new CommonActions();
