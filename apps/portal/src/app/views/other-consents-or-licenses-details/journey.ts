import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { BOOLEAN_OPTIONS, Journey, Section, questionHasAnswer } from '@planning-inspectorate/dynamic-forms';
import type { Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';

export function createJourney(
	applicationSectionId: string,
	questions: any,
	response: JourneyResponseLike,
	req: Request
) {
	if (!req.baseUrl.endsWith('/' + applicationSectionId)) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section(applicationSectionDisplayName, 'details')
				.addQuestion(questions.hasOtherConsents)
				.startMultiQuestionCondition('has-other-consents', (response) =>
					questionHasAnswer(response, questions.hasOtherConsents, BOOLEAN_OPTIONS.YES)
				)
				.addQuestion(questions.otherConsentsDescription)
				.addQuestion(questions.otherConsentsDocuments)
				.endMultiQuestionCondition('has-other-consents')
		],
		taskListUrl: 'check-your-answers',
		journeyTemplate: 'views/layouts/forms-question.njk',
		taskListTemplate: 'views/layouts/forms-check-your-answers.njk',
		journeyTitle: applicationSectionDisplayName,
		returnToListing: false,
		makeBaseUrl: () => req.baseUrl,
		initialBackLink: '/',
		response
	});
}
