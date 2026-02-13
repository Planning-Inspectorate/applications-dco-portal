import type { Handler, Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';
import { Journey, Section, whenQuestionHasAnswer } from '@planning-inspectorate/dynamic-forms';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';

export function createJourney(applicationSectionId: string, questions: any, response: Handler, req: Request) {
	if (!req.baseUrl.endsWith('/' + applicationSectionId)) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section(applicationSectionDisplayName, 'details')
				.addQuestion(questions.hasCrownLand)
				.addQuestion(questions.crownLand)
				.withCondition(whenQuestionHasAnswer(questions.hasCrownLand, BOOLEAN_OPTIONS.YES))
				.addQuestion(questions.hasMeansOfAccess)
				.addQuestion(questions.meansOfAccess)
				.withCondition(whenQuestionHasAnswer(questions.hasMeansOfAccess, BOOLEAN_OPTIONS.YES))
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
