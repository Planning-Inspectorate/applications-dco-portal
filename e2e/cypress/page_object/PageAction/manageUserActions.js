/**
 * @file User actions for managing project users.
 * @module page_object/PageAction/manageUserActions
 *
 * This class provides actions for inviting users, editing user access levels, and removing users.
 */

import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import ManageUserLocators from '../PageLocators/manageUserLocators.js';

/**
 * Encapsulates user administration workflows.
 */
class ManageUserActions {
	/**
	 * Authenticates the user and navigates to the user management dashboard.
	 *
	 * @returns {void}
	 */
	navigateToManageUsers() {
		CommonActions.login();
		ManageUserLocators.manageUsersLink().click();
		cy.url().should('include', '/manage-users');
		cy.get('.govuk-heading-l').should('contain.text', 'Manage users');
	}

	/**
	 * Invites a new user with a specified role.
	 *
	 * @param {string} email - The email address of the user to invite.
	 * @param {'standard'|'admin'} [role='standard'] - The assigned access level.
	 * @returns {void}
	 */
	inviteUser(email, role = 'standard') {
		ManageUserLocators.addUserLink().click();
		cy.url().should('include', '/add-user/user/email-address');

		ManageUserLocators.emailInput().clear().type(email);
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/add-user/user/access-level');
		if (role === 'admin') {
			ManageUserLocators.adminUserRadio().first().check({ force: true });
		} else {
			ManageUserLocators.standardUserRadio().first().check({ force: true });
		}
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/add-user/confirm-add-user');
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/manage-users');
		ManageUserLocators.notificationBanner().should('be.visible');
		ManageUserLocators.userTableRow(email).should('be.visible');
	}

	/**
	 * Updates the access level role of an existing project user.
	 *
	 * @param {string} email - The email address of the user to update.
	 * @param {'standard'|'admin'} newRole - The new access level role.
	 * @returns {void}
	 */
	changeUserRole(email, newRole) {
		ManageUserLocators.editUserLink(email).click();
		cy.url().should('include', '/edit-user/user/access-level');

		if (newRole === 'admin') {
			ManageUserLocators.adminUserRadio().first().check({ force: true });
		} else {
			ManageUserLocators.standardUserRadio().first().check({ force: true });
		}
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/confirm-changes');
		CommonLocators.saveAndContinueButton().click();

		cy.url().should('include', '/manage-users');
		ManageUserLocators.notificationBanner().should('be.visible');
		ManageUserLocators.userTableRow(email).should('contain.text', newRole === 'admin' ? 'Admin' : 'Standard');
	}

	/**
	 * Removes an existing user from the project after confirmation.
	 *
	 * @param {string} email - The email address of the user to remove.
	 * @returns {void}
	 */
	removeUser(email) {
		ManageUserLocators.removeUserLink(email).click();
		cy.url().should('include', '/remove-user');
		cy.contains('.govuk-summary-list', email).should('be.visible');

		ManageUserLocators.removeUserButton().click();

		cy.url().should('include', '/manage-users');
		ManageUserLocators.notificationBanner().should('be.visible');
		ManageUserLocators.usersTable().should('not.contain.text', email);
	}
}

export default new ManageUserActions();
