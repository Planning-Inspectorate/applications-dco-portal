/**
 * @file User actions for project questionnaire workflows.
 * @module page_object/PageAction/questionnaireActions
 *
 * This class provides actions for applicant details, agent information, project descriptions, and GIS coordinates.
 */

import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import QuestionnaireLocators from '../PageLocators/questionnaireLocators.js';

/**
 * Encapsulates actions for completing questionnaire steps.
 */
class QuestionnaireActions {
	/**
	 * Navigates to the applicant and agent details questionnaire section.
	 *
	 * @returns {void}
	 */
	openApplicantDetails() {
		CommonActions.login();
		QuestionnaireLocators.applicantDetailsLink().click();
		cy.url().should('include', '/applicant-and-agent-details');
	}

	/**
	 * Navigates to the about the project questionnaire section.
	 *
	 * @returns {void}
	 */
	openAboutTheProject() {
		CommonActions.login();
		QuestionnaireLocators.aboutTheProjectLink().click();
		cy.url().should('include', '/about-the-project');
	}

	/**
	 * Asserts that an error summary contains the expected validation message.
	 *
	 * @param {string|RegExp} message - The validation error text to verify.
	 * @returns {void}
	 */
	assertValidationError(message) {
		cy.get('.govuk-error-summary').should('be.visible');
		cy.contains(message).should('be.visible');
	}

	/**
	 * Completes the description, consent reason, and location steps for a project.
	 *
	 * @param {object} [options] - The project overview fields.
	 * @param {string} [options.description='Test project description'] - The project description text.
	 * @param {string} [options.consentReason='Test consent reason'] - The justification for development consent.
	 * @param {string} [options.location='Test location description'] - The description of the project location.
	 * @returns {void}
	 */
	fillProjectOverview({
		description = 'Test project description',
		consentReason = 'Test consent reason',
		location = 'Test location description'
	} = {}) {
		QuestionnaireLocators.projectDescriptionInput().clear().type(description);
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.projectConsentReasonInput().clear().type(consentReason);
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.projectLocationInput().clear().type(location);
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Configures easting and northing grid coordinates for a single site.
	 *
	 * @param {string} [easting='123456'] - The six-digit easting coordinate.
	 * @param {string} [northing='654321'] - The six-digit northing coordinate.
	 * @returns {void}
	 */
	configureSingleSiteCoordinates(easting = '123456', northing = '654321') {
		QuestionnaireLocators.siteTypeSingleRadio().click({ force: true });
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.eastingInput().clear().type(easting);
		QuestionnaireLocators.northingInput().clear().type(northing);
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Configures start, middle, and end coordinates for a linear site.
	 *
	 * @param {object} [options] - The coordinate endpoints.
	 * @param {{ easting: string, northing: string }} [options.start] - Start coordinates.
	 * @param {{ easting: string, northing: string }} [options.middle] - Middle coordinates.
	 * @param {{ easting: string, northing: string }} [options.end] - End coordinates.
	 * @returns {void}
	 */
	configureLinearSiteCoordinates({
		start = { easting: '123456', northing: '654321' },
		middle = { easting: '123456', northing: '654321' },
		end = { easting: '123456', northing: '654321' }
	} = {}) {
		cy.get('.govuk-back-link').click();
		cy.get('.govuk-back-link').click();

		QuestionnaireLocators.siteTypeLinearRadio().click({ force: true });
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.startEastingInput().clear().type(start.easting);
		QuestionnaireLocators.startNorthingInput().clear().type(start.northing);
		QuestionnaireLocators.middleEastingInput().clear().type(middle.easting);
		QuestionnaireLocators.middleNorthingInput().clear().type(middle.northing);
		QuestionnaireLocators.endEastingInput().clear().type(end.easting);
		QuestionnaireLocators.endNorthingInput().clear().type(end.northing);
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Completes the applicant questionnaire journey, with or without an agent.
	 *
	 * @param {boolean} [isAgent=false] - Whether an agent represents the applicant.
	 * @returns {void}
	 */
	fillApplicantDetails(isAgent = false) {
		this.openApplicantDetails();

		QuestionnaireLocators.applicantOrgInput().clear().type('Test Organisation');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.applicantFirstNameInput().clear().type('Test First Name');
		QuestionnaireLocators.applicantLastNameInput().clear().type('Test Last Name');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.applicantAddressLine1Input().clear().type('10 Test Street');
		QuestionnaireLocators.applicantAddressLine2Input().clear().type('Test Suite');
		QuestionnaireLocators.applicantTownInput().clear().type('Test City');
		QuestionnaireLocators.applicantCountyInput().clear().type('Test County');
		QuestionnaireLocators.applicantCountryInput().clear().type('United Kingdom');
		QuestionnaireLocators.applicantPostcodeInput().clear().type('TE5 7AD');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.applicantEmailInput().clear().type('applicant@example.com');
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.applicantPhoneInput().clear().type('0123456789');
		CommonLocators.saveAndContinueButton().click();

		if (isAgent) {
			QuestionnaireLocators.isAgentYesRadio().click({ force: true });
			CommonLocators.saveAndContinueButton().click();

			QuestionnaireLocators.agentOrgInput().clear().type('Agent Organisation');
			CommonLocators.saveAndContinueButton().click();

			QuestionnaireLocators.agentFirstNameInput().clear().type('Agent First Name');
			QuestionnaireLocators.agentLastNameInput().clear().type('Agent Last Name');
			CommonLocators.saveAndContinueButton().click();

			QuestionnaireLocators.agentAddressLine1Input().clear().type('20 Agent Way');
			QuestionnaireLocators.agentAddressLine2Input().clear().type('Floor 2');
			QuestionnaireLocators.agentTownInput().clear().type('Agent Town');
			QuestionnaireLocators.agentCountyInput().clear().type('Agent County');
			QuestionnaireLocators.agentCountryInput().clear().type('United Kingdom');
			QuestionnaireLocators.agentPostcodeInput().clear().type('TE5 7AD');
			CommonLocators.saveAndContinueButton().click();

			QuestionnaireLocators.agentEmailInput().clear().type('agent@example.com');
			CommonLocators.saveAndContinueButton().click();

			QuestionnaireLocators.agentPhoneInput().clear().type('0123456789');
			CommonLocators.saveAndContinueButton().click();
		} else {
			QuestionnaireLocators.isAgentNoRadio().click({ force: true });
			CommonLocators.saveAndContinueButton().click();
		}

		QuestionnaireLocators.paymentBacsRadio().click({ force: true });
		CommonLocators.saveAndContinueButton().click();

		QuestionnaireLocators.paymentRefInput().clear().type('PINS1234');
		CommonLocators.saveAndContinueButton().click();

		// Check your answers
		cy.url().should('include', '/check-your-answers');
		CommonLocators.saveAndContinueButton().click();
		cy.url().should('eq', Cypress.config().baseUrl);
	}
}

export default new QuestionnaireActions();
