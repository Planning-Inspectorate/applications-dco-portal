import commonLocators from '../PageLocators/commonLocators';
import loginPageLocators from '../PageLocators/loginPageLocators';
import loginPageActions from './loginPageActions';

const CSRF_INPUT_REGEX = /<input[^>]*name="_csrf"[^>]*value="([^"]+)"[^>]*>/;

class CommonActions {
	login() {
		cy.log(`TEST_TOOLS_TOKEN present: ${!!Cypress.env('TEST_TOOLS_TOKEN')}`);
		cy.request('/login/sign-in').then(({ body }) => {
			const csrfToken = body.match(CSRF_INPUT_REGEX)?.[1];

			expect(csrfToken, 'login sign-in page CSRF token').to.be.a('string').and.not.be.empty;

			cy.request({
				method: 'POST',
				url: '/login/test/setup-case',
				form: true,
				headers: {
					'x-test-tools-token': Cypress.env('TEST_TOOLS_TOKEN')
				},
				body: {
					_csrf: csrfToken,
					emailAddress: Cypress.env('USER_EMAIL'),
					caseReference: Cypress.env('TEST_APPLICATION_REFERENCE')
				}
			});
		});

		cy.visit('/login/sign-in');

		loginPageActions.signInWithCredentials(Cypress.env('USER_EMAIL'), Cypress.env('TEST_APPLICATION_REFERENCE'));

		cy.url().should('include', '/enter-code');

		loginPageLocators.otpCodeInput().type('ABCDE');
		commonLocators.saveAndContinueButton().click();
	}
}
export default new CommonActions();
