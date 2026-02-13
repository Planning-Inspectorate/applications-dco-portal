import { Journey, Section } from '@planning-inspectorate/dynamic-forms';
// @ts-expect-error - due to not having @types
import { questionHasAnswer } from '@planning-inspectorate/dynamic-forms/src/components/utils/question-has-answer.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type { Handler, Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';

export function createJourney(applicationSectionId: string, questions: any, response: Handler, req: Request) {
	if (!req.baseUrl.endsWith('/' + applicationSectionId)) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section(applicationSectionDisplayName, 'details')
				.addQuestion(questions.compulsoryAcquisition)
				.startMultiQuestionCondition('include-compulsory-acquisition', (response: Handler) =>
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
