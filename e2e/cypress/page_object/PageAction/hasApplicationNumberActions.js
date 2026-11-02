/**
 * @file User actions for the application number confirmation screen.
 * @module page_object/PageAction/hasApplicationNumberActions
 *
 * This class provides actions for responding to the application number question.
 */

import HasApplicationNumberLocators from '../PageLocators/hasApplicationNumberLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Encapsulates actions on the initial application reference verification screen.
 */
class HasApplicationNumberActions {
	/**
	 * Confirms that the user has an application number and advances to sign-in.
	 *
	 * @returns {void}
	 */
	confirmHasApplicationNumber() {
		HasApplicationNumberLocators.yesRadioButton().check();
		CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Confirms that the user does not have an application number and advances to access denied.
	 *
	 * @returns {void}
	 */
	confirmDoesNotHaveApplicationNumber() {
		HasApplicationNumberLocators.noRadioButton().check();
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new HasApplicationNumberActions();
