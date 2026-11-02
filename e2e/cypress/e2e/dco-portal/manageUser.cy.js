/**
 * @file End-to-end tests for user management and access delegation.
 * @module e2e/dco-portal/manageUser
 *
 * This test suite validates user lists, user invitations, role changes, email format validations, and user removal.
 */

/// <reference types="cypress" />
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';
import ManageUserActions from '../../page_object/PageAction/manageUserActions.js';
import ManageUserLocators from '../../page_object/PageLocators/manageUserLocators.js';

describe('Manage Users', () => {
	const TEST_EMAIL = 'simulate-delivered@notifications.service.gov.uk';

	beforeEach(() => {
		cy.task('deleteWhitelistUser', {
			email: TEST_EMAIL,
			reference: Cypress.env('TEST_APPLICATION_REFERENCE')
		});
	});

	afterEach(() => {
		cy.task('deleteWhitelistUser', {
			email: TEST_EMAIL,
			reference: Cypress.env('TEST_APPLICATION_REFERENCE')
		});
	});

	/**
	 * Verifies that the user management dashboard displays the current user table.
	 */
	it('displays current users list on manage users dashboard', () => {
		ManageUserActions.navigateToManageUsers();
		ManageUserLocators.usersTable().should('be.visible');
		cy.get('.govuk-heading-m').contains('Current users').should('be.visible');
	});

	/**
	 * Verifies inviting a new user with standard permissions.
	 */
	it('invites a new standard user successfully', () => {
		ManageUserActions.navigateToManageUsers();
		ManageUserActions.inviteUser(TEST_EMAIL, 'standard');
		ManageUserLocators.userTableRow(TEST_EMAIL).should('contain.text', 'Standard');
	});

	/**
	 * Verifies updating the permission level of an existing user from standard to admin.
	 */
	it('changes user access level from standard to admin', () => {
		ManageUserActions.navigateToManageUsers();
		ManageUserActions.inviteUser(TEST_EMAIL, 'standard');
		ManageUserActions.changeUserRole(TEST_EMAIL, 'admin');
	});

	/**
	 * Verifies validation errors when submitting an empty email or an invalid email address format.
	 */
	it('validates email address format when adding a user', () => {
		ManageUserActions.navigateToManageUsers();
		ManageUserLocators.addUserLink().click();
		cy.url().should('include', '/add-user/user/email-address');

		// Empty submission
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('Enter an email address').should('be.visible');

		// Invalid format
		ManageUserLocators.emailInput().type('invalid-email-format');
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('Enter an email address in the correct format').should('be.visible');
	});

	/**
	 * Verifies removing an existing user from the case whitelist.
	 */
	it('removes an existing user from the project', () => {
		ManageUserActions.navigateToManageUsers();
		ManageUserActions.inviteUser(TEST_EMAIL, 'standard');
		ManageUserActions.removeUser(TEST_EMAIL);
	});
});
