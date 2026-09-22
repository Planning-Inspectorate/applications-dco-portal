import LoginPageLocators from '../PageLocators/loginPageLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Actions for the DCO Portal sign-in page.
 */
class LoginPageActions {
	/**
	 * Enters the user's credentials and submits the sign-in form.
	 *
	 * @param {string} email - The invited user's email address.
	 * @param {string} applicationNumber - The DCO application reference.
	 * @returns {Cypress.Chainable<undefined>} The completed form submission chain.
	 */
	signInWithCredentials(email, applicationNumber) {
		LoginPageLocators.emailInput().clear().type(email);
		LoginPageLocators.applicationNumberInput().clear().type(applicationNumber);
		return CommonLocators.saveAndContinueButton().click();
	}
}

export default new LoginPageActions();
