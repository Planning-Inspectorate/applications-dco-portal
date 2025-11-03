import UploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';
import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';

class UploadDocumentsActions {
	//tasks are 0-indexed
	openTask(index) {
		UploadDocumentsLocators.taskList().eq(index).find('a').click();
	}

	reachDocumentUploadPage(taskIndex) {
		CommonActions.login();
		this.openTask(taskIndex);
		UploadDocumentsLocators.uploadDocumentsButton().click();
		UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
		CommonLocators.saveAndContinueButton().click();
	}
}

export default new UploadDocumentsActions();
