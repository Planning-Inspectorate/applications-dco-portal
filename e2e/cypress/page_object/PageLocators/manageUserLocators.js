/**
 * @file Page locators for user management workflows.
 * @module page_object/PageLocators/manageUserLocators
 *
 * This class provides selectors for user administration, invitations, and role management screens.
 */

/**
 * Encapsulates selectors for the user management dashboard and forms.
 */
class ManageUserLocators {
	/**
	 * Returns the navigation link to the user management dashboard.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The link element chainable.
	 */
	manageUsersLink() {
		return cy.contains('a.govuk-link', 'Manage users');
	}

	/**
	 * Returns the link to open the add user invitation flow.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The link element chainable.
	 */
	addUserLink() {
		return cy.contains('a.govuk-link', 'Add a user');
	}

	/**
	 * Returns the email input field on the add user page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The text input element chainable.
	 */
	emailInput() {
		return cy.get('input[name="emailAddress"]');
	}

	/**
	 * Returns the radio button for the standard user role.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	standardUserRadio() {
		return cy.get('input[name="accessLevel"][value="standard-user"], [data-cy="answer-standard-user"]');
	}

	/**
	 * Returns the radio button for the administrator role.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio input element chainable.
	 */
	adminUserRadio() {
		return cy.get('input[name="accessLevel"][value="admin-user"], [data-cy="answer-admin-user"]');
	}

	/**
	 * Returns the GOV.UK notification banner on the user management page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The notification banner element chainable.
	 */
	notificationBanner() {
		return cy.get('.govuk-notification-banner');
	}

	/**
	 * Returns the table element displaying current project users.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The table element chainable.
	 */
	usersTable() {
		return cy.get('.govuk-table');
	}

	/**
	 * Returns the table row element matching a given user email address.
	 *
	 * @param {string} email - The email address of the user.
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The matching table row element chainable.
	 */
	userTableRow(email) {
		return cy.get('.govuk-table').contains('b', email).parents('tr');
	}

	/**
	 * Returns the edit link for a specific user row.
	 *
	 * @param {string} email - The email address of the user to edit.
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The edit link element chainable.
	 */
	editUserLink(email) {
		return this.userTableRow(email).contains('a.govuk-link', 'Edit');
	}

	/**
	 * Returns the remove link for a specific user row.
	 *
	 * @param {string} email - The email address of the user to remove.
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The remove link element chainable.
	 */
	removeUserLink(email) {
		return this.userTableRow(email).contains('a.govuk-link', 'Remove');
	}

	/**
	 * Returns the confirm button on the remove user confirmation page.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The submit button element chainable.
	 */
	removeUserButton() {
		return cy.get('.govuk-button').contains(/Remove this user/i);
	}
}

export default new ManageUserLocators();
