/// <reference types="cypress" />
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';
import QuestionnaireActions from '../../page_object/PageAction/questionnaireActions.js';
import QuestionnaireLocators from '../../page_object/PageLocators/questionnaireLocators.js';

describe('About the project', () => {
	it('validates required inputs for description, consent reason, and location', () => {
		QuestionnaireActions.openAboutTheProject();

		// Empty description
		QuestionnaireLocators.projectDescriptionInput().clear();
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('Enter a project description').should('be.visible');

		// Fill description
		QuestionnaireLocators.projectDescriptionInput().type('Test project description');
		CommonLocators.saveAndContinueButton().click();

		// Empty consent reason
		QuestionnaireLocators.projectConsentReasonInput().clear();
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('Enter an explanation for why the project requires development consent').should('be.visible');

		// Fill consent reason
		QuestionnaireLocators.projectConsentReasonInput().type('Test consent reason');
		CommonLocators.saveAndContinueButton().click();

		// Empty location
		QuestionnaireLocators.projectLocationInput().clear();
		CommonLocators.saveAndContinueButton().click();
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains('Enter the project location or route').should('be.visible');

		// Fill location
		QuestionnaireLocators.projectLocationInput().type('Test location description');
		CommonLocators.saveAndContinueButton().click();
	});

	it('configures single site and linear site coordinates', () => {
		QuestionnaireActions.openAboutTheProject();
		QuestionnaireLocators.projectDescriptionInput().clear().type('Test project description');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.projectConsentReasonInput().clear().type('Test consent reason');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.projectLocationInput().clear().type('Test location description');
		CommonLocators.saveAndContinueButton().click();

		// Single site
		QuestionnaireLocators.siteTypeSingleRadio().click({ force: true });
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.eastingInput().clear().type('123456');
		QuestionnaireLocators.northingInput().clear().type('654321');
		CommonLocators.saveAndContinueButton().click();

		// Navigate back and switch to linear site
		cy.get('.govuk-back-link').click();
		cy.get('.govuk-back-link').click();

		QuestionnaireLocators.siteTypeLinearRadio().click({ force: true });
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.startEastingInput().clear().type('123456');
		QuestionnaireLocators.startNorthingInput().clear().type('654321');
		QuestionnaireLocators.middleEastingInput().clear().type('123456');
		QuestionnaireLocators.middleNorthingInput().clear().type('654321');
		QuestionnaireLocators.endEastingInput().clear().type('123456');
		QuestionnaireLocators.endNorthingInput().clear().type('654321');
		CommonLocators.saveAndContinueButton().click();
	});
});
