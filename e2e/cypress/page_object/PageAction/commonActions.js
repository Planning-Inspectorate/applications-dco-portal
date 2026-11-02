/**
 * @file Common user actions shared across end-to-end tests.
 * @module page_object/PageAction/commonActions
 *
 * This class provides shared actions such as user authentication and session preservation.
 */

import commonLocators from '../PageLocators/commonLocators';
import loginPageLocators from '../PageLocators/loginPageLocators';
import loginPageActions from './loginPageActions';

/**
 * Encapsulates common workflow actions used across test suites.
 */
class CommonActions {
	/**
	 * Authenticates a test user and caches the session across test specs.
	 *
	 * Configures the case through the test endpoint.
	 * Enters credentials on the sign-in page.
	 * Submits the one-time passcode to reach the dashboard.
	 *
	 * @param {string} [emailAddress] - The user email address. Defaults to the environment configuration.
	 * @param {string} [caseReference] - The application reference code. Defaults to the environment configuration.
	 * @returns {void}
	 */
	login(emailAddress, caseReference) {
		const email = emailAddress || Cypress.env('USER_EMAIL');
		const ref = caseReference || Cypress.env('TEST_APPLICATION_REFERENCE');

		cy.session(
			`auth-${email}-${ref}`,
			() => {
				cy.clearCookies();
				cy.clearAllSessionStorage();
				cy.request({
					method: 'POST',
					url: '/login/test/setup-case',
					headers: {
						'x-test-tools-token': Cypress.env('TEST_TOOLS_TOKEN')
					},
					body: {
						emailAddress: email,
						caseReference: ref
					}
				});

				cy.visit('/login/sign-in');
				loginPageActions.signInWithCredentials(email, ref);
				cy.url().should('include', '/login/enter-code');
				loginPageLocators.otpCodeInput().should('be.visible').type('ABCDE');
				commonLocators.saveAndContinueButton().click();
				cy.contains('h1', ref).should('be.visible');
			},
			{
				cacheAcrossSpecs: true,
				validate() {
					cy.request({ url: '/', failOnStatusCode: false }).then((resp) => {
						expect(resp.status).to.eq(200);
						if (resp.redirects && resp.redirects.length > 0) {
							const finalUrl = resp.redirects[resp.redirects.length - 1];
							expect(finalUrl).to.not.include('/login');
							expect(finalUrl).to.not.include('/session-expired');
							expect(finalUrl).to.not.include('/application-complete');
						}
					});
				}
			}
		);

		cy.visit('/');
	}
}

export default new CommonActions();
