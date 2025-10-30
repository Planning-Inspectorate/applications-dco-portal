import HomePageLocators from '../PageLocators/homePageLocators.js';
import CommonLocators from '../PageLocators/commonLocators.js';

class HomePageActions {
	enterEmailAddress(email) {
		HomePageLocators.emailInput().clear().type(email);
	}

	enterApplicationNumber(applicationNumber) {
		HomePageLocators.applicationNumberInput().clear().type(applicationNumber);
	}

	submitLoginDetails() {
		CommonLocators.saveAndContinueButton().click();
	}

	signInWithValidCredentials(email, applicationNumber) {
		this.enterEmailAddress(email);
		this.enterApplicationNumber(applicationNumber);
		this.submitLoginDetails();
	}
}

export default new HomePageActions();
