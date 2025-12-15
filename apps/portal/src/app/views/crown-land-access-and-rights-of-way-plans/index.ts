import type { PortalService } from '#service';
import type { Handler, Request } from 'express';
import { Router as createRouter } from 'express';
import type { IRouter } from 'express';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { buildGetJourney } from '@planning-inspectorate/dynamic-forms/src/middleware/build-get-journey.js';
import { createJourney } from './journey.ts';
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
import { getApplicationSectionDisplayName } from '../util.ts';
import { selectDocumentQuestionMiddleware } from '../middleware/select-document-middleware.ts';
import { buildCrownLandAccessAndRightsOfWayPlansHomePage } from './controller.ts';
import { buildSaveController } from './save.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req: Request, journeyResponse: Handler) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const crownLandAccessAndRightsOfWayPlansHomePage = buildCrownLandAccessAndRightsOfWayPlansHomePage(
		service,
		applicationSectionId
	);
	const saveController = buildSaveController(service, applicationSectionId);

	const selectDocumentQuestion = selectDocumentQuestionMiddleware(service);

	router.get('/', asyncHandler(crownLandAccessAndRightsOfWayPlansHomePage));

	router.get('/:section/:question', getJourneyResponse, getJourney, selectDocumentQuestion, question);
	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.get('/check-your-answers', getJourneyResponse, getJourney, (req, res) =>
		list(req, res, getApplicationSectionDisplayName(applicationSectionId), {})
	);
	router.post('/check-your-answers', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
