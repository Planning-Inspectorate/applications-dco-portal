class ManageUserLocators {
	manageUsersLink() {
		return cy.contains('a.govuk-link', 'Manage users');
	}

	addUserLink() {
		return cy.contains('a.govuk-link', 'Add a user');
	}

	emailInput() {
		return cy.get('input[name="emailAddress"]');
	}

	standardUserRadio() {
		return cy.get('input[name="accessLevel"][value="standard-user"], [data-cy="answer-standard-user"]');
	}

	adminUserRadio() {
		return cy.get('input[name="accessLevel"][value="admin-user"], [data-cy="answer-admin-user"]');
	}

	notificationBanner() {
		return cy.get('.govuk-notification-banner');
	}

	usersTable() {
		return cy.get('.govuk-table');
	}

	userTableRow(email) {
		return cy.get('.govuk-table').contains('b', email).parents('tr');
	}

	editUserLink(email) {
		return this.userTableRow(email).contains('a.govuk-link', 'Edit');
	}

	removeUserLink(email) {
		return this.userTableRow(email).contains('a.govuk-link', 'Remove');
	}

	removeUserButton() {
		return cy.get('.govuk-button').contains(/Remove this user/i);
	}
}

export default new ManageUserLocators();
