/**
 * @file Page locators for project questionnaires and applicant details.
 * @module page_object/PageLocators/questionnaireLocators
 *
 * This class provides selectors for applicant information, agent details, project metadata, and geospatial inputs.
 */

/**
 * Encapsulates selectors for questionnaire form controls.
 */
class QuestionnaireLocators {
	/**
	 * Returns the task list link for applicant and agent details.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The link element chainable.
	 */
	applicantDetailsLink() {
		return cy.contains('a.govuk-link', 'Applicant and agent details');
	}

	/**
	 * Returns the task list link for project details.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The link element chainable.
	 */
	aboutTheProjectLink() {
		return cy.contains('a.govuk-link', 'About the project');
	}

	/**
	 * Returns the applicant organisation name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantOrgInput() {
		return cy.get('[name="applicantOrganisation"]');
	}

	/**
	 * Returns the applicant first name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantFirstNameInput() {
		return cy.get('[name="applicantFirstName"]');
	}

	/**
	 * Returns the applicant last name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantLastNameInput() {
		return cy.get('[name="applicantLastName"]');
	}

	/**
	 * Returns the applicant address line 1 input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantAddressLine1Input() {
		return cy.get('[name="applicantAddress_addressLine1"]');
	}

	/**
	 * Returns the applicant address line 2 input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantAddressLine2Input() {
		return cy.get('[name="applicantAddress_addressLine2"]');
	}

	/**
	 * Returns the applicant town or city input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantTownInput() {
		return cy.get('[name="applicantAddress_townCity"]');
	}

	/**
	 * Returns the applicant county input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantCountyInput() {
		return cy.get('[name="applicantAddress_county"]');
	}

	/**
	 * Returns the applicant country input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantCountryInput() {
		return cy.get('[name="applicantAddress_country"]');
	}

	/**
	 * Returns the applicant postcode input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantPostcodeInput() {
		return cy.get('[name="applicantAddress_postcode"]');
	}

	/**
	 * Returns the applicant email address input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantEmailInput() {
		return cy.get('[name="applicantEmailAddress"]');
	}

	/**
	 * Returns the applicant telephone number input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	applicantPhoneInput() {
		return cy.get('[name="applicantPhone"]');
	}

	/**
	 * Returns the radio button indicating no agent is representing the applicant.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	isAgentNoRadio() {
		return cy.get('[data-cy="answer-no"], input[name="isAgent"][value="no"]');
	}

	/**
	 * Returns the radio button indicating an agent represents the applicant.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	isAgentYesRadio() {
		return cy.get('[data-cy="answer-yes"], input[name="isAgent"][value="yes"]');
	}

	/**
	 * Returns the agent organisation name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentOrgInput() {
		return cy.get('[name="agentOrganisation"]');
	}

	/**
	 * Returns the agent first name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentFirstNameInput() {
		return cy.get('[name="agentFirstName"]');
	}

	/**
	 * Returns the agent last name input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentLastNameInput() {
		return cy.get('[name="agentLastName"]');
	}

	/**
	 * Returns the agent address line 1 input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentAddressLine1Input() {
		return cy.get('[name="agentAddress_addressLine1"]');
	}

	/**
	 * Returns the agent address line 2 input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentAddressLine2Input() {
		return cy.get('[name="agentAddress_addressLine2"]');
	}

	/**
	 * Returns the agent town or city input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentTownInput() {
		return cy.get('[name="agentAddress_townCity"]');
	}

	/**
	 * Returns the agent county input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentCountyInput() {
		return cy.get('[name="agentAddress_county"]');
	}

	/**
	 * Returns the agent country input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentCountryInput() {
		return cy.get('[name="agentAddress_country"]');
	}

	/**
	 * Returns the agent postcode input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentPostcodeInput() {
		return cy.get('[name="agentAddress_postcode"]');
	}

	/**
	 * Returns the agent email address input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentEmailInput() {
		return cy.get('[name="agentEmailAddress"]');
	}

	/**
	 * Returns the agent telephone number input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	agentPhoneInput() {
		return cy.get('[name="agentPhone"]');
	}

	/**
	 * Returns the radio button selecting BACS payment method.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	paymentBacsRadio() {
		return cy.get('[data-cy="answer-bacs"], input[value="bacs"]');
	}

	/**
	 * Returns the radio button selecting CHAPS payment method.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	paymentChapsRadio() {
		return cy.get('[data-cy="answer-chaps"], input[value="chaps"]');
	}

	/**
	 * Returns the radio button selecting cheque payment method.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	paymentChequeRadio() {
		return cy.get('[data-cy="answer-cheque"], input[value="cheque"]');
	}

	/**
	 * Returns the payment reference text input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	paymentRefInput() {
		return cy.get('[name="paymentReference"]');
	}

	/**
	 * Returns the project description textarea input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The textarea element chainable.
	 */
	projectDescriptionInput() {
		return cy.get('[name="description"]');
	}

	/**
	 * Returns the consent reason textarea input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The textarea element chainable.
	 */
	projectConsentReasonInput() {
		return cy.get('[name="consentReason"]');
	}

	/**
	 * Returns the project location description textarea input field.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The textarea element chainable.
	 */
	projectLocationInput() {
		return cy.get('[name="locationDescription"]');
	}

	/**
	 * Returns the radio button selecting a single site layout.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	siteTypeSingleRadio() {
		return cy.get('[data-cy="answer-single"], input[name="siteType"][value="single"]');
	}

	/**
	 * Returns the radio button selecting a linear site layout.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The radio element chainable.
	 */
	siteTypeLinearRadio() {
		return cy.get('[data-cy="answer-linear"], input[name="siteType"][value="linear"]');
	}

	/**
	 * Returns the easting coordinate input field for a single site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	eastingInput() {
		return cy.get('[name="easting"]');
	}

	/**
	 * Returns the northing coordinate input field for a single site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	northingInput() {
		return cy.get('[name="northing"]');
	}

	/**
	 * Returns the starting easting coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	startEastingInput() {
		return cy.get('[name="startEasting"]');
	}

	/**
	 * Returns the starting northing coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	startNorthingInput() {
		return cy.get('[name="startNorthing"]');
	}

	/**
	 * Returns the middle easting coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	middleEastingInput() {
		return cy.get('[name="middleEasting"]');
	}

	/**
	 * Returns the middle northing coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	middleNorthingInput() {
		return cy.get('[name="middleNorthing"]');
	}

	/**
	 * Returns the ending easting coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	endEastingInput() {
		return cy.get('[name="endEasting"]');
	}

	/**
	 * Returns the ending northing coordinate input field for a linear site.
	 *
	 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The input element chainable.
	 */
	endNorthingInput() {
		return cy.get('[name="endNorthing"]');
	}
}

export default new QuestionnaireLocators();
