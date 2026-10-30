import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildDraftOrderAndExplanatoryMemorandumHomePage } from './controller.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
import { buildSaveController } from './save.ts';
import { getApplicationSectionDisplayName } from '../util.ts';

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
import { selectDocumentQuestionMiddleware } from '../middleware/select-document-middleware.ts';
import { removeIsEditingJourneyMiddleware, someoneElseEditingJourneyMiddleware } from '../middleware/session.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req, journeyResponse) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const draftOrderAndExplanatoryMemorandumHomePage = buildDraftOrderAndExplanatoryMemorandumHomePage(
		service,
		applicationSectionId
	);
	const saveController = buildSaveController(service, applicationSectionId);

	const selectDocumentQuestion = selectDocumentQuestionMiddleware(service);

	const someoneElseEditingJourney = someoneElseEditingJourneyMiddleware(service, applicationSectionId);
	const removeIsEditingJourney = removeIsEditingJourneyMiddleware(service, applicationSectionId);

	router.get('/', asyncHandler(draftOrderAndExplanatoryMemorandumHomePage));

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
