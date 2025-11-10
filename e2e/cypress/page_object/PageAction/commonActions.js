class CommonActions {
	login() {
		/*
			WIP
		cy.on('window:before:load', (win) => {
			// Replace crypto.getRandomValues with a deterministic version - will return ABCDE... for x = OTP_LENGTH characters
			cy.stub(win.crypto, 'getRandomValues').callsFake((arr) => {
			  for (let i = 0; i < arr.length; i++) arr[i] = 0;
			  return arr;
			});
		});

		cy.visit('/login/sign-in');

		//sign in with valid creds
		HomePageActions.signInWithValidCredentials(Cypress.env('USER_EMAIL'), Cypress.env('TEST_APPLICATION_REFERENCE'));
		cy.url().should('include', '/enter-code');

		LoginPageLocators.otpCodeInput().type('ABCDE');
		CommonLocators.saveAndContinueButton().click();
		*/
		cy.request({
			method: 'POST',
			url: '/login/test',
			body: {
				emailAddress: 'inspectorappeals.test@planninginspectorate.gov.uk',
				caseReference: 'EN123456' //WIP - ENSURE THESE MATCH YOUR .ENV EMAIL/REFERENCES
			},
			followRedirect: true
		});
		cy.visit('/');
	}
}

export default new CommonActions();
