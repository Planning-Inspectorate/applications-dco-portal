class QuestionnaireLocators {
	applicantDetailsLink() {
		return cy.contains('a.govuk-link', 'Applicant and agent details');
	}

	aboutTheProjectLink() {
		return cy.contains('a.govuk-link', 'About the project');
	}

	applicantOrgInput() {
		return cy.get('[name="applicantOrganisation"]');
	}

	applicantFirstNameInput() {
		return cy.get('[name="applicantFirstName"]');
	}

	applicantLastNameInput() {
		return cy.get('[name="applicantLastName"]');
	}

	applicantAddressLine1Input() {
		return cy.get('[name="applicantAddress_addressLine1"]');
	}

	applicantAddressLine2Input() {
		return cy.get('[name="applicantAddress_addressLine2"]');
	}

	applicantTownInput() {
		return cy.get('[name="applicantAddress_townCity"]');
	}

	applicantCountyInput() {
		return cy.get('[name="applicantAddress_county"]');
	}

	applicantCountryInput() {
		return cy.get('[name="applicantAddress_country"]');
	}

	applicantPostcodeInput() {
		return cy.get('[name="applicantAddress_postcode"]');
	}

	applicantEmailInput() {
		return cy.get('[name="applicantEmailAddress"]');
	}

	applicantPhoneInput() {
		return cy.get('[name="applicantPhone"]');
	}

	isAgentNoRadio() {
		return cy.get('[data-cy="answer-no"], input[name="isAgent"][value="no"]');
	}

	isAgentYesRadio() {
		return cy.get('[data-cy="answer-yes"], input[name="isAgent"][value="yes"]');
	}

	agentOrgInput() {
		return cy.get('[name="agentOrganisation"]');
	}

	agentFirstNameInput() {
		return cy.get('[name="agentFirstName"]');
	}

	agentLastNameInput() {
		return cy.get('[name="agentLastName"]');
	}

	agentAddressLine1Input() {
		return cy.get('[name="agentAddress_addressLine1"]');
	}

	agentAddressLine2Input() {
		return cy.get('[name="agentAddress_addressLine2"]');
	}

	agentTownInput() {
		return cy.get('[name="agentAddress_townCity"]');
	}

	agentCountyInput() {
		return cy.get('[name="agentAddress_county"]');
	}

	agentCountryInput() {
		return cy.get('[name="agentAddress_country"]');
	}

	agentPostcodeInput() {
		return cy.get('[name="agentAddress_postcode"]');
	}

	agentEmailInput() {
		return cy.get('[name="agentEmailAddress"]');
	}

	agentPhoneInput() {
		return cy.get('[name="agentPhone"]');
	}

	paymentBacsRadio() {
		return cy.get('[data-cy="answer-bacs"], input[value="bacs"]');
	}

	paymentChapsRadio() {
		return cy.get('[data-cy="answer-chaps"], input[value="chaps"]');
	}

	paymentChequeRadio() {
		return cy.get('[data-cy="answer-cheque"], input[value="cheque"]');
	}

	paymentRefInput() {
		return cy.get('[name="paymentReference"]');
	}

	projectDescriptionInput() {
		return cy.get('[name="description"]');
	}

	projectConsentReasonInput() {
		return cy.get('[name="consentReason"]');
	}

	projectLocationInput() {
		return cy.get('[name="locationDescription"]');
	}

	siteTypeSingleRadio() {
		return cy.get('[data-cy="answer-single"], input[name="siteType"][value="single"]');
	}

	siteTypeLinearRadio() {
		return cy.get('[data-cy="answer-linear"], input[name="siteType"][value="linear"]');
	}

	eastingInput() {
		return cy.get('[name="easting"]');
	}

	northingInput() {
		return cy.get('[name="northing"]');
	}

	startEastingInput() {
		return cy.get('[name="startEasting"]');
	}

	startNorthingInput() {
		return cy.get('[name="startNorthing"]');
	}

	middleEastingInput() {
		return cy.get('[name="middleEasting"]');
	}

	middleNorthingInput() {
		return cy.get('[name="middleNorthing"]');
	}

	endEastingInput() {
		return cy.get('[name="endEasting"]');
	}

	endNorthingInput() {
		return cy.get('[name="endNorthing"]');
	}
}

export default new QuestionnaireLocators();
