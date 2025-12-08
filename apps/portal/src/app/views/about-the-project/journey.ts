// @ts-expect-error - due to not having @types
import { Section } from '@planning-inspectorate/dynamic-forms/src/section.js';
// @ts-expect-error - due to not having @types
import { Journey } from '@planning-inspectorate/dynamic-forms/src/journey/journey.js';
// @ts-expect-error - due to not having @types
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms/src/journey/journey-response.js';
// @ts-expect-error - due to not having @types
import { questionHasAnswer } from '@planning-inspectorate/dynamic-forms/src/components/utils/question-has-answer.js';
import type { Handler, Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';
import { PROJECT_SITE_TYPE_IDS } from './constants.ts';

export function createJourney(applicationSectionId: string, questions: any, response: Handler, req: Request) {
	if (!req.baseUrl.endsWith('/' + applicationSectionId)) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section(applicationSectionDisplayName, 'about')
				.addQuestion(questions.consentReason)
				.addQuestion(questions.description)
				.addQuestion(questions.locationDescription)
				.addQuestion(questions.singleOrLinear)
				.addQuestion(questions.singleGridReferences)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(response, questions.singleOrLinear, PROJECT_SITE_TYPE_IDS.SINGLE)
				)
				.addQuestion(questions.linearGridReferences)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(response, questions.singleOrLinear, PROJECT_SITE_TYPE_IDS.LINEAR)
				)
		],
		taskListUrl: 'check-your-answers',
		journeyTemplate: 'views/layouts/forms-question.njk',
		taskListTemplate: 'views/layouts/forms-check-your-answers.njk',
		journeyTitle: `About the Project`,
		returnToListing: false,
		makeBaseUrl: () => req.baseUrl,
		initialBackLink: '/',
		response
	});
}
