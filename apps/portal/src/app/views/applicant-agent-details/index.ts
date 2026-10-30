import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildApplicantAgentDetailsHomePage } from './controller.ts';
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
import { removeIsEditingJourneyMiddleware, someoneElseEditingJourneyMiddleware } from '../middleware/session.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req, journeyResponse) =>
		createJourney(applicationSectionId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(applicationSectionId);

	const applicantAgentDetailsHomePage = buildApplicantAgentDetailsHomePage(
		service,
		APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
	);
	const saveController = buildSaveController(service, applicationSectionId);

	const someoneElseEditingJourney = someoneElseEditingJourneyMiddleware(service, applicationSectionId);
	const removeIsEditingJourney = removeIsEditingJourneyMiddleware(service, applicationSectionId);

	router.get('/', asyncHandler(applicantAgentDetailsHomePage));

	router.get('/:section/:question', getJourneyResponse, getJourney, someoneElseEditingJourney, question);
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
			pageHeading: 'Check your answers',
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
