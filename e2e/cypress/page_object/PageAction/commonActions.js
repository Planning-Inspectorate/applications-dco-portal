import commonLocators from '../PageLocators/commonLocators';
import loginPageLocators from '../PageLocators/loginPageLocators';
import loginPageActions from './loginPageActions';

/**
 * Shared journeys used by authenticated DCO Portal end-to-end tests.
 */
class CommonActions {
	/**
	 * Creates the configured end-to-end case and completes the test sign-in flow.
	 *
	 * The test endpoint creates the case and whitelist entry, and the browser steps
	 * then exercise the real sign-in and OTP verification pages.
	 *
	 * @returns {Cypress.Chainable<void>} The completed login command chain.
	 */
	login() {
		return cy
			.readEnv(['TEST_TOOLS_TOKEN', 'USER_EMAIL', 'TEST_APPLICATION_REFERENCE'])
			.then(({ TEST_TOOLS_TOKEN, USER_EMAIL, TEST_APPLICATION_REFERENCE }) => {
				cy.log(`TEST_TOOLS_TOKEN present: ${!!TEST_TOOLS_TOKEN}`);

				cy.session(
					[USER_EMAIL, TEST_APPLICATION_REFERENCE],
					() => {
						cy.request({
							method: 'POST',
							url: '/login/test/setup-case',
							headers: {
								'x-test-tools-token': TEST_TOOLS_TOKEN
							},
							body: {
								emailAddress: USER_EMAIL,
								caseReference: TEST_APPLICATION_REFERENCE
							}
						});

						cy.visit('/login/sign-in');
						loginPageActions.signInWithCredentials(USER_EMAIL, TEST_APPLICATION_REFERENCE);
						cy.url().should('include', '/enter-code');
						loginPageLocators.otpCodeInput().type('ABCDE');
						commonLocators.saveAndContinueButton().click();
						// Wait for the login form submission to complete and the redirect to the dashboard
						// to finish, so the session is fully established before returning.
						cy.url().should('eq', Cypress.config().baseUrl);
					},
					{
						validate() {
							cy.request('/').then((resp) => {
								expect(resp.status).to.eq(200);
								// If the session is invalid, the backend redirects to /session-expired or /login/...
								// The response URL will show where we ended up.
								if (resp.redirects && resp.redirects.length > 0) {
									const finalUrl = resp.redirects[resp.redirects.length - 1];
									expect(finalUrl).to.not.include('/session-expired');
									expect(finalUrl).to.not.include('/login');
								}
							});
						},
						cacheAcrossSpecs: true
					}
				);
				cy.visit('/');
			});
	}
}
export default new CommonActions();
