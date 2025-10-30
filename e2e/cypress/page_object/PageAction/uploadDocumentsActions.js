import uploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';

class uploadDocumentsActions {
	//tasks are 0-indexed
	openTask(index) {
		uploadDocumentsLocators.taskList().eq(index).find('a').click();
	}

	selectDocumentTypeByValue(value) {
		uploadDocumentsLocators.getDocumentTypeRadioButtonByValue(value).check();
	}
}

export default new uploadDocumentsActions();
