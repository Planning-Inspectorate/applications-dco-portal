/**
 * @file User actions for the sign-in page.
 * @module page_object/PageAction/loginPageActions
 *
 * This class provides actions for submitting credentials on the sign-in screen.
 */

import LoginPageLocators from '../PageLocators/loginPageLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Encapsulates actions on the user login form.
 */
class LoginPageActions {
	/**
	 * Enters the email address and application reference, then submits the form.
	 *
	 * @param {string} email - The user email address.
	 * @param {string} applicationNumber - The application reference code.
	 * @returns {void}
	 */
	signInWithCredentials(email, applicationNumber) {
		LoginPageLocators.emailInput().clear().type(email);
		LoginPageLocators.applicationNumberInput().clear().type(applicationNumber);
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new LoginPageActions();
