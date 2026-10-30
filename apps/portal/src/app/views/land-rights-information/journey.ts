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
				.addQuestion(questions.compulsoryAcquisition)
				.startMultiQuestionCondition('include-compulsory-acquisition', (response) =>
					questionHasAnswer(response, questions.compulsoryAcquisition, BOOLEAN_OPTIONS.YES)
				)
				.addQuestion(questions.statementOfReasons)
				.addQuestion(questions.fundingStatement)
				.addQuestion(questions.bookOfReference)
				.addQuestion(questions.landAndRightsNegotiationsTracker)
				.endMultiQuestionCondition('include-compulsory-acquisition')
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
