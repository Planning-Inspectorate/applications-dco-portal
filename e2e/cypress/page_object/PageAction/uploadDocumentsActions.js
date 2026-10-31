import UploadDocumentsLocators from '../PageLocators/uploadDocumentsLocators.js';
import CommonActions from './commonActions.js';
import CommonLocators from '../PageLocators/commonLocators.js';

class UploadDocumentsActions {
	openTask(indexOrFragment) {
		if (typeof indexOrFragment === 'number') {
			UploadDocumentsLocators.taskList().eq(indexOrFragment).find('a').click();
		} else {
			cy.get(`a[href*="${indexOrFragment}"]`).first().click();
		}
	}

	reachDocumentUploadPage(taskIndexOrFragment) {
		CommonActions.login();
		this.openTask(taskIndexOrFragment);
		UploadDocumentsLocators.uploadDocumentsButton().click();
		UploadDocumentsLocators.getDocumentTypeRadioButtons().eq(0).check();
		CommonLocators.saveAndContinueButton().click();
	}

	confirmUploadAndVerify(urlFragment, fileName) {
		UploadDocumentsLocators.confirmUploadButton().click();
		cy.url().should('include', urlFragment);
		cy.get('.govuk-heading-m').contains('Documents uploaded').should('be.visible');
		UploadDocumentsLocators.uploadedDocumentsTable().should('contain.text', fileName);
	}
}

export default new UploadDocumentsActions();
