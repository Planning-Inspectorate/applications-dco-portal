/**
 * @file Common page locators shared across application workflows.
 * @module page_object/PageLocators/commonLocators
 *
 * This class provides element locators that appear across multiple pages.
 */

/**
 * Encapsulates selectors for shared interface controls.
 */
class CommonLocators {
	/**
	 * Returns the primary submit or continue button on the active page.
	 * Matches specific test attributes or standard GOV.UK button text.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The button element chainable.
	 */
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
