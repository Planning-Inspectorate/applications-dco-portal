/**
 * @file Page locators for the statutory declaration and application submission pages.
 * @module page_object/PageLocators/submissionLocators
 *
 * This class provides selectors for the statutory declaration form and completion panel.
 */

/**
 * Encapsulates selectors for declaration inputs and final submission elements.
 */
class SubmissionLocators {
	/**
	 * Returns the first name input field on the declaration page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	firstNameInput() {
		return cy.get('input[name="declarationFirstName"]');
	}

	/**
	 * Returns the last name input field on the declaration page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	lastNameInput() {
		return cy.get('input[name="declarationLastName"]');
	}

	/**
	 * Returns the organisation name input field on the declaration page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	orgInput() {
		return cy.get('input[name="declarationOrganisation"]');
	}

	/**
	 * Returns the position input field on the declaration page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	positionInput() {
		return cy.get('input[name="positionInOrganisation"]');
	}

	/**
	 * Returns the statutory declaration acceptance checkbox.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The checkbox input element chainable.
	 */
	confirmationCheckbox() {
		return cy.get('input[name="declarationConfirmation"][value="confirm"]');
	}

	/**
	 * Returns the submit button on the statutory declaration page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The submit button element chainable.
	 */
	submitButton() {
		return cy.get('.govuk-button').contains(/Confirm and submit/i);
	}

	/**
	 * Returns the GOV.UK completion panel displayed after submission.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The completion panel element chainable.
	 */
	completePanel() {
		return cy.get('.govuk-panel');
	}
}

export default new SubmissionLocators();
