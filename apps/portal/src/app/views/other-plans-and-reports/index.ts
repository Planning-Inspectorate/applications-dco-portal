import { Router as createRouter } from 'express';
import type { Handler, Request } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildOtherPlansAndReportsHomePage } from './controller.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
import { buildSaveController } from './save.ts';
import { getApplicationSectionDisplayName } from '../util.ts';
import { OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS } from '@pins/dco-portal-database/src/seed/data-static.ts';

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
import { selectMultipleDocumentQuestionMiddleware } from '../middleware/select-document-middleware.ts';
import { removeIsEditingJourneyMiddleware, someoneElseEditingJourneyMiddleware } from '../middleware/session.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req: Request, journeyResponse: Handler) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const otherPlansAndReportsHomePage = buildOtherPlansAndReportsHomePage(service, applicationSectionId);
	const saveController = buildSaveController(service, applicationSectionId);

	const selectMultipleDocumentQuestion = selectMultipleDocumentQuestionMiddleware(
		service,
		OTHER_PLANS_AND_REPORTS_SUBCATEGORY_MAPPINGS
	);

	const someoneElseEditingJourney = someoneElseEditingJourneyMiddleware(service, applicationSectionId);
	const removeIsEditingJourney = removeIsEditingJourneyMiddleware(service, applicationSectionId);

	router.get('/', asyncHandler(otherPlansAndReportsHomePage));

	router.get(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		selectMultipleDocumentQuestion,
		someoneElseEditingJourney,
		question
	);
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
	router.post(
		'/check-your-answers',
		getJourneyResponse,
		getJourney,
		removeIsEditingJourney,
		asyncHandler(saveController)
	);

	return router;
}
