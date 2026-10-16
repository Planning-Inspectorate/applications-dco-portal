import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { Journey, Section } from '@planning-inspectorate/dynamic-forms';
import type { Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';

export function createJourney(
	applicationSectionId: string,
	questions: any,
	response: JourneyResponseLike,
	req: Request
) {
	const validBaseUrlSuffixes = ['/' + applicationSectionId, '/publicity-details'];

	if (!validBaseUrlSuffixes.some((suffix) => req.baseUrl.endsWith(suffix))) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [new Section(applicationSectionDisplayName, 'details').addQuestion(questions.newspaperNotices)],
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
