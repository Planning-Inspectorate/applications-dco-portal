class CommonLocators {
	saveAndContinueButton() {
		return cy.get('body').then(($body) => {
			if ($body.find('[data-cy="button-save-and-continue"]').length > 0) {
				return cy.get('[data-cy="button-save-and-continue"]');
			}
			return cy
				.get('.govuk-button')
				.contains(/Save and continue|Continue|Submit|Accept|Confirm|Save and return|Save|Add user/i);
		});
	}
}

export default new CommonLocators();
