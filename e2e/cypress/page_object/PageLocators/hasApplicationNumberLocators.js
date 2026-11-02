/**
 * @file Page locators for the application number confirmation screen.
 * @module page_object/PageLocators/hasApplicationNumberLocators
 *
 * This class provides selectors for the initial application reference question.
 */

/**
 * Encapsulates selectors for the application reference check page.
 */
class HasApplicationNumberLocators {
	/**
	 * Returns the radio button confirming the user has an application number.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	yesRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="yes"]');
	}

	/**
	 * Returns the radio button indicating the user lacks an application number.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	noRadioButton() {
		return cy.get('input[name="hasReferenceNumber"][value="no"]');
	}
}

export default new HasApplicationNumberLocators();
