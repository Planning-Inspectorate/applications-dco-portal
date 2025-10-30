import LoginPageLocators from '../PageLocators/loginPageLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';
class LoginPageActions {
	signInWithCredentials(email, applicationNumber) {
		LoginPageLocators.emailInput().clear().type(email);
		LoginPageLocators.applicationNumberInput().clear().type(applicationNumber);
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new LoginPageActions();
