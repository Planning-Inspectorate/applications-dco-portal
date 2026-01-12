// @ts-expect-error - due to not having @types
import { Section } from '@planning-inspectorate/dynamic-forms/src/section.js';
// @ts-expect-error - due to not having @types
import { Journey } from '@planning-inspectorate/dynamic-forms/src/journey/journey.js';
// @ts-expect-error - due to not having @types
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms/src/journey/journey-response.js';
// @ts-expect-error - due to not having @types
import { questionHasAnswer } from '@planning-inspectorate/dynamic-forms/src/components/utils/question-has-answer.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
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
				.addQuestion(questions.hasAdditionalInformation)
				.startMultiQuestionCondition('additional-information', (response: Handler) =>
					questionHasAnswer(response, questions.hasAdditionalInformation, BOOLEAN_OPTIONS.YES)
				)
				.addQuestion(questions.additionalInformationDescription)
				.addQuestion(questions.additionalInformationDocuments)
				.startMultiQuestionCondition('offshore-generating-station', (response: Handler) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION
					)
				)
				.addQuestion(questions.cableInstallation)
				.addQuestion(questions.safetyZones)
				.addQuestion(questions.offshoreGeneratingStation)
				.endMultiQuestionCondition('offshore-generating-station')
				.startMultiQuestionCondition('non-offshore-generating-station', (response: Handler) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION
					)
				)
				.addQuestion(questions.electricityGrid)
				.addQuestion(questions.gasFuelledGeneratingStation)
				.addQuestion(questions.gasPipelineConnection)
				.addQuestion(questions.nonOffshoreGeneratingStation)
				.endMultiQuestionCondition('non-offshore-generating-station')
				.addQuestion(questions.highwayRelatedDevelopment)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT
					)
				)
				.addQuestion(questions.railwayDevelopment)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT
					)
				)
				.addQuestion(questions.harbourFacilities)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES
					)
				)
				.addQuestion(questions.pipelines)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(response, questions.additionalInformationDocuments, DOCUMENT_SUB_CATEGORY_ID.PIPELINES)
				)
				.addQuestion(questions.hazardousWasteFacility)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY
					)
				)
				.addQuestion(questions.damOrReservoir)
				.withCondition((response: JourneyResponse) =>
					questionHasAnswer(
						response,
						questions.additionalInformationDocuments,
						DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR
					)
				)
				.endMultiQuestionCondition('additional-information')
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
