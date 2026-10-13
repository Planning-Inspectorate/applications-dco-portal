import CommonActions from '../../page_object/PageAction/commonActions.js';

describe('Applicant Agent Details', () => {
	it('', () => {
		cy.window().then((win) => {
			win.sessionStorage.clear();
			win.localStorage.clear();
		});

		CommonActions.login();
		cy.get(':nth-child(6) > :nth-child(1) > .govuk-task-list__name-and-hint > .govuk-link')
			.contains('Applicant and agent details')
			.click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="applicantOrganisation"]').type('Test Organisation');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('[name="applicantFirstName"]').type('Test First Name');
		cy.get('[name="applicantLastName"]').type('Test Last Name');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('[name="applicantAddress_addressLine1"]').clear();
		cy.get('[name="applicantAddress_addressLine1"]').type('Test Address Line 1');
		cy.get('[name="applicantAddress_addressLine2"]').clear;
		cy.get('[name="applicantAddress_addressLine2"]').type('Test Address Line 2');
		cy.get('[name="applicantAddress_townCity"]').clear();
		cy.get('[name="applicantAddress_townCity"]').type('Test Town');
		cy.get('[name="applicantAddress_county"]').clear();
		cy.get('[name="applicantAddress_county"]').type('Test County');
		cy.get('[name="applicantAddress_country"]').clear();
		cy.get('[name="applicantAddress_country"]').type('Test Country');
		cy.get('[name="applicantAddress_postcode"]').clear();
		cy.get('[name="applicantAddress_postcode"]').type('TE5 7AD');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="applicantEmailAddress"]').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="applicantPhone"]').type('0123456789');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('[data-cy="answer-no"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('[data-cy="answer-bacs"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="paymentReference"]').type('PINS1234');
		cy.get('.govuk-back-link').click();
		cy.get('[data-cy="answer-chaps"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="paymentReference"]').type('PINS1234');
		cy.get('.govuk-back-link').click();
		cy.get('[data-cy="answer-cheque"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="paymentReference"]').clear();
		cy.get('[name="paymentReference"]').type('PINS1234');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-heading-l').should('be.visible');
		cy.get('.govuk-button').click();
	});
});
