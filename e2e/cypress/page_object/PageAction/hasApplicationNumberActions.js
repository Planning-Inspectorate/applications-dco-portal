import HasApplicationNumberLocators from '../PageLocators/hasApplicationNumberLocators.js';

class HasApplicationNumberActions {
	confirmHasApplicationNumber() {
		HasApplicationNumberLocators.yesRadioButton().check();
		HasApplicationNumberLocators.saveAndContinueButton().click();
	}

	confirmDoesNotHaveApplicationNumber() {
		HasApplicationNumberLocators.noRadioButton().check();
		HasApplicationNumberLocators.saveAndContinueButton().click();
	}
}

export default new HasApplicationNumberActions();
