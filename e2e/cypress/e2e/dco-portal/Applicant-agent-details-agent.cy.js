/// <reference types="cypress" />
import QuestionnaireActions from '../../page_object/PageAction/questionnaireActions.js';

describe('Applicant Details - With Agent', () => {
	it('completes applicant details journey with an authorized agent', () => {
		QuestionnaireActions.fillApplicantDetails(true);
	});
});
