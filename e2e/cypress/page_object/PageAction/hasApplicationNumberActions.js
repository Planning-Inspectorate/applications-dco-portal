import HasApplicationNumberLocators from '../PageLocators/hasApplicationNumberLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

class HasApplicationNumberActions {
	confirmHasApplicationNumber() {
		HasApplicationNumberLocators.yesRadioButton().check();
		CommonLocators.saveAndContinueButton().click();
	}

	confirmDoesNotHaveApplicationNumber() {
		HasApplicationNumberLocators.noRadioButton().check();
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new HasApplicationNumberActions();
