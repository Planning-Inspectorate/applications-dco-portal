import HasApplicationNumberLocators from '../PageLocators/hasApplicationNumberLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

/**
 * Actions for the application-reference question.
 */
class HasApplicationNumberActions {
	/**
	 * Selects Yes and continues to the sign-in page.
	 *
	 * @returns {Cypress.Chainable<undefined>} The completed form submission chain.
	 */
	confirmHasApplicationNumber() {
		HasApplicationNumberLocators.yesRadioButton().check();
		return CommonLocators.saveAndContinueButton().click();
	}

	/**
	 * Selects No and continues to the no-access guidance page.
	 *
	 * @returns {Cypress.Chainable<undefined>} The completed form submission chain.
	 */
	confirmDoesNotHaveApplicationNumber() {
		HasApplicationNumberLocators.noRadioButton().check();
		return CommonLocators.saveAndContinueButton().click();
	}
}

export default new HasApplicationNumberActions();
