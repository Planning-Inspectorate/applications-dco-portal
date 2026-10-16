import type { JourneyResponseLike } from '@planning-inspectorate/dynamic-forms';
import { BOOLEAN_OPTIONS, Journey, Section, whenQuestionHasAnswer } from '@planning-inspectorate/dynamic-forms';
import type { Request } from 'express';
import { getApplicationSectionDisplayName } from '../util.ts';
import { PROJECT_SITE_TYPE_IDS, CBOS_PREPOPULATED_HTML_TEMPLATES } from './constants.ts';

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
			if (req.session.cbosPopulated[populatedQuestionKey] && questions[populatedQuestionKey]) {
				questions[populatedQuestionKey].html =
					CBOS_PREPOPULATED_HTML_TEMPLATES[populatedQuestionKey] ||
					'views/html-templates/prepopulated-data-template.html';
			}
		}
	}

	const applicationSectionDisplayName = getApplicationSectionDisplayName(applicationSectionId);

	return new Journey({
		journeyId: applicationSectionId,
		sections: [
			new Section(applicationSectionDisplayName, 'about')
				.addQuestion(questions.description)
				.addQuestion(questions.consentReason)
				.addQuestion(questions.locationDescription)
				.addQuestion(questions.singleOrLinear)
				.addQuestion(questions.singleGridReferences)
				.withCondition(whenQuestionHasAnswer(questions.singleOrLinear, PROJECT_SITE_TYPE_IDS.SINGLE))
				.addQuestion(questions.linearGridReferences)
				.withCondition(whenQuestionHasAnswer(questions.singleOrLinear, PROJECT_SITE_TYPE_IDS.LINEAR))
				.addQuestion(questions.locationOrRouteDocuments)
				.addQuestion(questions.hasAssociatedDevelopments)
				.addQuestion(questions.associatedDevelopments)
				.withCondition(whenQuestionHasAnswer(questions.hasAssociatedDevelopments, BOOLEAN_OPTIONS.YES))
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
