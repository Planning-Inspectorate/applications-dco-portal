import { Router as createRouter } from 'express';
import type { Handler, Request } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildAboutTheProjectHomePage } from './controller.ts';
import { buildIsTaskCompleted, getApplicationSectionDisplayName } from '../util.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
import { buildSaveController } from './save.ts';
// @ts-expect-error - due to not having @types
import { buildGetJourney } from '@planning-inspectorate/dynamic-forms/src/middleware/build-get-journey.js';
import {
	buildGetJourneyResponseFromSession,
	saveDataToSession
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
// @ts-expect-error - due to not having @types
import { list, question, buildSave } from '@planning-inspectorate/dynamic-forms/src/controller.js';
// @ts-expect-error - due to not having @types
import validate from '@planning-inspectorate/dynamic-forms/src/validator/validator.js';
// @ts-expect-error - due to not having @types
import { validationErrorHandler } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const questions = getQuestions();
	const getJourney = buildGetJourney((req: Request, journeyResponse: Handler) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const aboutTheProjectHomePage = buildAboutTheProjectHomePage();
	const isAboutTheProjectCompleted = buildIsTaskCompleted(service, applicationSectionId, buildAboutTheProjectHomePage);
	const saveController = buildSaveController(service, applicationSectionId);

	router.get('/', asyncHandler(aboutTheProjectHomePage));
	router.post('/', isAboutTheProjectCompleted);

	router.get('/:section/:question', getJourneyResponse, getJourney, question);
	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.get('/check-your-answers', getJourneyResponse, getJourney, (req, res) =>
		list(req, res, getApplicationSectionDisplayName(applicationSectionId), {
			pageHeading: 'Check your answers before confirming'
		})
	);
	router.post('/check-your-answers', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
