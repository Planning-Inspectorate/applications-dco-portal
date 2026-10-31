import commonLocators from '../PageLocators/commonLocators';
import loginPageLocators from '../PageLocators/loginPageLocators';
import loginPageActions from './loginPageActions';

class CommonActions {
	login(emailAddress, caseReference) {
		const email = emailAddress || Cypress.env('USER_EMAIL');
		const ref = caseReference || Cypress.env('TEST_APPLICATION_REFERENCE');

		cy.session(
			`auth-${email}-${ref}`,
			() => {
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
				loginPageLocators.otpCodeInput().type('ABCDE');
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
