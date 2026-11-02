/**
 * @file End-to-end tests for the About the Project questionnaire section.
 * @module e2e/dco-portal/aboutTheProject
 *
 * This test suite validates project descriptions, development consent justifications, and site coordinates.
 */

/// <reference types="cypress" />
import CommonLocators from '../../page_object/PageLocators/commonLocators.js';
import QuestionnaireActions from '../../page_object/PageAction/questionnaireActions.js';
import QuestionnaireLocators from '../../page_object/PageLocators/questionnaireLocators.js';

describe('About the project', () => {
	/**
	 * Verifies validation errors when submitting empty inputs for description, consent reason, and location.
	 */
	it('validates required inputs for description, consent reason, and location', () => {
		QuestionnaireActions.openAboutTheProject();

		// Description validation
		QuestionnaireLocators.projectDescriptionInput().clear();
		CommonLocators.saveAndContinueButton().click();
		QuestionnaireActions.assertValidationError('Enter a project description');

		QuestionnaireLocators.projectDescriptionInput().type('Test project description');
		CommonLocators.saveAndContinueButton().click();

		// Consent reason validation
		QuestionnaireLocators.projectConsentReasonInput().clear();
		CommonLocators.saveAndContinueButton().click();
		QuestionnaireActions.assertValidationError('Enter an explanation for why the project requires development consent');

		QuestionnaireLocators.projectConsentReasonInput().type('Test consent reason');
		CommonLocators.saveAndContinueButton().click();

		// Location validation
		QuestionnaireLocators.projectLocationInput().clear();
		CommonLocators.saveAndContinueButton().click();
		QuestionnaireActions.assertValidationError('Enter the project location or route');

		QuestionnaireLocators.projectLocationInput().type('Test location description');
		CommonLocators.saveAndContinueButton().click();
	});

	/**
	 * Verifies entering British National Grid coordinates for single site and linear site layouts.
	 */
	it('configures single site and linear site coordinates', () => {
		QuestionnaireActions.openAboutTheProject();
		QuestionnaireActions.fillProjectOverview();
		QuestionnaireActions.configureSingleSiteCoordinates('123456', '654321');
		QuestionnaireActions.configureLinearSiteCoordinates({
			start: { easting: '123456', northing: '654321' },
			middle: { easting: '123456', northing: '654321' },
			end: { easting: '123456', northing: '654321' }
		});
	});
});
