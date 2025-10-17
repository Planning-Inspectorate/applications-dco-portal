import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';
import type { IRouter } from 'express';
import { buildFileUploadHomePage } from './controller.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { buildGetJourney } from '@planning-inspectorate/dynamic-forms/src/middleware/build-get-journey.js';
import {
	saveDataToSession,
	buildGetJourneyResponseFromSession
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
// @ts-expect-error - due to not having @types
import { list, question, buildSave } from '@planning-inspectorate/dynamic-forms/src/controller.js';
// @ts-expect-error - due to not having @types
import validate from '@planning-inspectorate/dynamic-forms/src/validator/validator.js';
// @ts-expect-error - due to not having @types
import { validationErrorHandler } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';

export function createRoutes(service: PortalService, documentTypeId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions(documentTypeId);
	const getJourney = buildGetJourney((req: any, journeyResponse: any) =>
		createJourney(documentTypeId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(documentTypeId);

	const fileUploadHomePage = buildFileUploadHomePage(service, documentTypeId);

	router.get('/', asyncHandler(fileUploadHomePage));

	router.get('/:section/:question', getJourneyResponse, getJourney, question);

	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.get('/check-your-answers', getJourneyResponse, getJourney, (req, res) => list(req, res, '', {}));
	// router.post('/check-your-answers', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
