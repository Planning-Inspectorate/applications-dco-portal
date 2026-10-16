import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { Journey, Section } from '@planning-inspectorate/dynamic-forms';
import type { Request } from 'express';

export const JOURNEY_ID = 'edit-user';

export function createJourney(questions: any, response: JourneyResponseLike, req: Request) {
	if (!req.baseUrl.includes('/' + JOURNEY_ID)) {
		throw new Error(`not a valid request for the ${JOURNEY_ID} journey`);
	}

	return new Journey({
		journeyId: JOURNEY_ID,
		sections: [new Section('Edit user', 'user').addQuestion(questions.accessLevel)],
		taskListUrl: 'confirm-changes',
		journeyTemplate: 'views/layouts/forms-question.njk',
		taskListTemplate: 'views/whitelist/edit/edit-user-check-your-answers.njk',
		journeyTitle: 'Edit user',
		returnToListing: false,
		makeBaseUrl: () => req.baseUrl,
		initialBackLink: '/manage-users',
		response
	});
}
