import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';
import QuestionnaireLocators from '../PageLocators/questionnaireLocators.js';

class QuestionnaireActions {
	openApplicantDetails() {
		CommonActions.login();
		QuestionnaireLocators.applicantDetailsLink().click();
		cy.url().should('include', '/applicant-and-agent-details');
	}

	openAboutTheProject() {
		CommonActions.login();
		QuestionnaireLocators.aboutTheProjectLink().click();
		cy.url().should('include', '/about-the-project');
	}

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
