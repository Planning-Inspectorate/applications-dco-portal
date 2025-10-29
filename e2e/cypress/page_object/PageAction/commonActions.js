class CommonActions {
	login() {
		cy.visit('/');
		//WIP
		//cy.testLogin(Cypress.env('USER_EMAIL'), Cypress.env('TEST_APPLICATION_REFERENCE'));
		cy.visit('/');
	}
}

export default new CommonActions();
