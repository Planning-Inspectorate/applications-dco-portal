import UploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';
import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';

class UploadDocumentsActions {
	//tasks are 0-indexed
	openTask(index) {
		UploadDocumentsLocators.taskList().eq(index).find('a').click();
	}

	selectDocumentTypeByValue(value) {
		UploadDocumentsLocators.getDocumentTypeRadioButtonByValue(value).check();
	}

	reachDocumentUploadPage() {
		CommonActions.login();
		this.openTask(0);
		UploadDocumentsLocators.uploadDocumentsButton().click();
		UploadDocumentsLocators.getDocumentTypeRadioButtonByValue('guide-to-the-application').check();
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new UploadDocumentsActions();
