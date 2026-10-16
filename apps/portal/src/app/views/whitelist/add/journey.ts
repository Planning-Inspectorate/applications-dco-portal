import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { Journey, Section } from '@planning-inspectorate/dynamic-forms';
import type { Request } from 'express';

export const JOURNEY_ID = 'add-user';

export function createJourney(questions: any, response: JourneyResponseLike, req: Request) {
	if (!req.baseUrl.includes('/' + JOURNEY_ID)) {
		throw new Error(`not a valid request for the ${JOURNEY_ID} journey`);
	}

	return new Journey({
		journeyId: JOURNEY_ID,
		sections: [new Section('Add user', 'user').addQuestion(questions.emailAddress).addQuestion(questions.accessLevel)],
		taskListUrl: 'confirm-add-user',
		journeyTemplate: 'views/layouts/forms-question.njk',
		taskListTemplate: 'views/layouts/forms-check-your-answers.njk',
		journeyTitle: 'Add user',
		returnToListing: false,
		makeBaseUrl: () => req.baseUrl,
		initialBackLink: '/manage-users',
		response
	});
}
