// @ts-expect-error - due to not having @types
import { Section } from '@planning-inspectorate/dynamic-forms/src/section.js';
// @ts-expect-error - due to not having @types
import { Journey } from '@planning-inspectorate/dynamic-forms/src/journey/journey.js';
import type { Handler, Request } from 'express';
import { getDocumentCategoryDisplayName } from './util.ts';

export function createJourney(documentTypeId: string, questions: any, response: Handler, req: Request) {
	if (!req.baseUrl.endsWith('/' + documentTypeId)) {
		throw new Error(`not a valid request for the ${documentTypeId} document upload journey`);
	}

	const documentTypeDisplayName = getDocumentCategoryDisplayName(documentTypeId);

	return new Journey({
		journeyId: documentTypeId,
		sections: [
			new Section(documentTypeDisplayName, 'upload')
				.addQuestion(questions.documentType)
				.addQuestion(questions.fileUpload)
				.addQuestion(questions.apfpRegulation)
				.addQuestion(questions.isCertified)
		],
		taskListUrl: 'check-your-answers',
		journeyTemplate: 'views/layouts/forms-question.njk',
		listingPageViewPath: 'views/layouts/forms-check-your-answers.njk',
		journeyTitle: `Upload document`,
		returnToListing: false,
		makeBaseUrl: () => req.baseUrl,
		initialBackLink: req.baseUrl,
		response
	});
}
