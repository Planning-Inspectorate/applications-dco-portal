import CommonActions from '../../page_object/PageAction/commonActions.js';

describe('About the project', () => {
	it('', () => {
		cy.window().then((win) => {
			win.sessionStorage.clear();
			win.localStorage.clear();
		});

		CommonActions.login();
		cy.get(':nth-child(6) > :nth-child(2) > .govuk-task-list__name-and-hint > .govuk-link')
			.contains('About the project')
			.click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="description"]').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[name="description"]').type('Test project description');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-label').should('be.visible');
		cy.get('[name="consentReason"]').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[name="consentReason"]').type('Test consent reason');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[name="locationDescription"]').type('Test location description');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get(':nth-child(1) > .govuk-label').should('be.visible');
		cy.get(':nth-child(2) > .govuk-label').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[data-cy="answer-single"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get(':nth-child(2) > .govuk-label').should('be.visible');
		cy.get(':nth-child(3) > .govuk-label').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[name="easting"]').type('123456');
		cy.get('[name="northing"]').type('654321');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-back-link').click();
		cy.get('.govuk-back-link').click();
		cy.get('[data-cy="answer-linear"]').click();
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-fieldset__heading').should('be.visible');
		cy.get('.govuk-fieldset > :nth-child(2)').should('be.visible');
		cy.get('[data-cy="button-save-and-continue"]').click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.get('[name="startEasting"]').should('be.visible');
		cy.get('[name="startEasting"]').type('123456');
		cy.get('[name="startNorthing"]').should('be.visible');
		cy.get('[name="startNorthing"]').type('654321');
		cy.get('.govuk-fieldset > :nth-child(5)').should('be.visible');
		cy.get('[name="middleEasting"]').should('be.visible');
		cy.get('[name="middleEasting"]').type('123456');
		cy.get('[name="middleNorthing"]').should('be.visible');
		cy.get('[name="middleNorthing"]').type('654321');
		cy.get('.govuk-fieldset > :nth-child(5)').should('be.visible');
		cy.get('[name="endEasting"]').should('be.visible');
		cy.get('[name="endEasting"]').type('123456');
		cy.get('[name="endNorthing"]').should('be.visible');
		cy.get('[name="endNorthing"]').type('654321');
		cy.get('[data-cy="button-save-and-continue"]').click();
	});
});
