import { useSyncExternalStore } from 'react';
import CommonActions from '../../page_object/PageAction/commonActions.js';

describe('About the project', () => {
	it('', () => {
		cy.window().then((win) => {
			win.sessionStorage.clear();
			win.localStorage.clear();
		});

		CommonActions.login();
		cy.get('.govuk-grid-column-two-thirds > :nth-child(2) > .govuk-link').contains('Manage users').click();
		cy.get('.govuk-heading-l').should('be.visible');
		cy.get('.govuk-heading-m').should('be.visible');
		cy.get(':nth-child(5) > .govuk-link').should('be.visible').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="emailAddress"]').type('joe.bloggs@planninginspectorate.gov.uk');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('[data-cy="answer-standard-user"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get(':nth-child(1) > .govuk-summary-list__actions > .govuk-link').click();
		cy.get('[name="emailAddress"]').clear();
		cy.get('[name="emailAddress"]').type('mark.sanders@planninginspectorate.gov.uk');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('[data-cy="answer-admin-user"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-button').click();
		cy.get('.govuk-notification-banner').should('be.visible');
	});
});
