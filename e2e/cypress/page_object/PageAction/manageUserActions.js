import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import ManageUserLocators from '../PageLocators/manageUserLocators.js';

class ManageUserActions {
	navigateToManageUsers() {
		CommonActions.login();
		ManageUserLocators.manageUsersLink().click();
		cy.url().should('include', '/manage-users');
		cy.get('.govuk-heading-l').should('contain.text', 'Manage users');
	}

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
