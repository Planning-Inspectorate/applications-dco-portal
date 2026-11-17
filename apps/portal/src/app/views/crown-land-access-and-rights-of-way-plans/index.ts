import type { PortalService } from '#service';
import { Router as createRouter } from 'express';
import type { IRouter } from 'express';
import { asyncHandler } from '@planning-inspectorate/core/util';
import { getQuestions } from './questions.ts';
import {
	buildGetJourney,
	buildGetJourneyResponseFromSession,
	buildSave,
	list,
	question,
	saveDataToSession,
	validate,
	validationErrorHandler
} from '@planning-inspectorate/dynamic-forms';
import { createJourney } from './journey.ts';
import { getApplicationSectionDisplayName } from '../util.ts';
import { selectDocumentQuestionMiddleware } from '../middleware/select-document-middleware.ts';
import { buildCrownLandAccessAndRightsOfWayPlansHomePage } from './controller.ts';
import { buildSaveController } from './save.ts';
import { removeIsEditingJourneyMiddleware, someoneElseEditingJourneyMiddleware } from '../middleware/session.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req, journeyResponse) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const crownLandAccessAndRightsOfWayPlansHomePage = buildCrownLandAccessAndRightsOfWayPlansHomePage(
		service,
		applicationSectionId
	);
	const saveController = buildSaveController(service, applicationSectionId);

	const selectDocumentQuestion = selectDocumentQuestionMiddleware(service);

	const someoneElseEditingJourney = someoneElseEditingJourneyMiddleware(service, applicationSectionId);
	const removeIsEditingJourney = removeIsEditingJourneyMiddleware(service, applicationSectionId);

	router.get('/', asyncHandler(crownLandAccessAndRightsOfWayPlansHomePage));

	router.get(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		selectDocumentQuestion,
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
		list(req, res, getApplicationSectionDisplayName(applicationSectionId), {
			submitButtonText: 'Save and return'
		})
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
