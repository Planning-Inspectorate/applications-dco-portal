import { Journey, Section } from '@planning-inspectorate/dynamic-forms';
// @ts-expect-error - due to not having @types
import { questionHasAnswer } from '@planning-inspectorate/dynamic-forms/src/components/utils/question-has-answer.js';
import type { Handler, Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';

export function createJourney(applicationSectionId: string, questions: any, response: Handler, req: Request) {
	if (!req.baseUrl.endsWith('/' + applicationSectionId)) {
		throw new Error(`not a valid request for the ${applicationSectionId} journey`);
	}

	if (req.session?.cbosPopulated) {
		for (const populatedQuestionKey of Object.keys(req.session.cbosPopulated)) {
			if (req.session.cbosPopulated[populatedQuestionKey] && questions[populatedQuestionKey])
				questions[populatedQuestionKey].html = 'views/prepopulated-data-template.html';
		}
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section('Applicant Details', 'applicant')
				.addQuestion(questions.applicantOrganisation)
				.addQuestion(questions.applicantName)
				.addQuestion(questions.applicantEmailAddress)
				.addQuestion(questions.applicantPhone)
				.addQuestion(questions.applicantAddress),
			new Section('Agent Details', 'agent')
				.addQuestion(questions.isAgent)
				.startMultiQuestionCondition('agent-questions', (response: Handler) =>
					questionHasAnswer(response, questions.isAgent, BOOLEAN_OPTIONS.YES)
				)
				.addQuestion(questions.agentOrganisation)
				.addQuestion(questions.agentName)
				.addQuestion(questions.agentEmailAddress)
				.addQuestion(questions.agentPhone)
				.addQuestion(questions.agentAddress)
				.endMultiQuestionCondition('agent-questions'),
			new Section('Payment Details', 'payment')
				.addQuestion(questions.paymentMethod)
				.addQuestion(questions.paymentReference)
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
