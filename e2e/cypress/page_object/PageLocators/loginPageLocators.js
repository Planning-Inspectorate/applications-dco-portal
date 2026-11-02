/**
 * @file Page locators for user sign-in and passcode verification screens.
 * @module page_object/PageLocators/loginPageLocators
 *
 * This class provides selectors for user authentication form controls.
 */

/**
 * Encapsulates selectors for the login flow pages.
 */
class LoginPageLocators {
	/**
	 * Returns the email address text input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The email input element chainable.
	 */
	emailInput() {
		return cy.get('input[name="emailAddress"]');
	}

	/**
	 * Returns the application reference number text input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The case reference input element chainable.
	 */
	applicationNumberInput() {
		return cy.get('input[name="caseReference"]');
	}

	/**
	 * Returns the one-time passcode text input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The OTP input element chainable.
	 */
	otpCodeInput() {
		return cy.get('input[name="otpCode"]');
	}
}

export default new LoginPageLocators();
