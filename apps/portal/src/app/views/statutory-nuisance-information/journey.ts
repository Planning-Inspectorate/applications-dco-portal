import type { Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';
import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { BOOLEAN_OPTIONS, Journey, Section, whenQuestionHasAnswer } from '@planning-inspectorate/dynamic-forms';

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
				.addQuestion(questions.hasStatutoryNuisanceStatement)
				.addQuestion(questions.statutoryNuisanceStatement)
				.withCondition(whenQuestionHasAnswer(questions.hasStatutoryNuisanceStatement, BOOLEAN_OPTIONS.YES))
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
