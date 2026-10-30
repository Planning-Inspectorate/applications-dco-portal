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

	if (req.session?.cbosPopulated) {
		for (const populatedQuestionKey of Object.keys(req.session.cbosPopulated)) {
			if (req.session.cbosPopulated[populatedQuestionKey] && questions[populatedQuestionKey])
				questions[populatedQuestionKey].hint =
					'You can update this information, but you must tell the case team about any changes';
		}
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section('Applicant details', 'applicant')
				.addQuestion(questions.applicantOrganisation)
				.addQuestion(questions.applicantName)
				.addQuestion(questions.applicantAddress)
				.addQuestion(questions.applicantEmailAddress)
				.addQuestion(questions.applicantPhone),
			new Section('Agent details', 'agent')
				.addQuestion(questions.isAgent)
				.startMultiQuestionCondition('agent-questions', (response) =>
					questionHasAnswer(response, questions.isAgent, BOOLEAN_OPTIONS.YES)
				)
				.addQuestion(questions.agentOrganisation)
				.addQuestion(questions.agentName)
				.addQuestion(questions.agentAddress)
				.addQuestion(questions.agentEmailAddress)
				.addQuestion(questions.agentPhone)
				.endMultiQuestionCondition('agent-questions'),
			new Section('Application fee details', 'payment')
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
