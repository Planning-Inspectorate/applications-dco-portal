import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@planning-inspectorate/core/util';
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
import { buildSaveController } from './controller.ts';
import { getQuestions } from './questions.ts';
import { createJourney, JOURNEY_ID } from './journey.ts';
import { addWhitelistErrors } from '../util.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req, journeyResponse) => createJourney(questions, journeyResponse, req));
	const getJourneyResponse = buildGetJourneyResponseFromSession(JOURNEY_ID);

	const saveController = buildSaveController(service);

	router.get('/:section/:question', getJourneyResponse, getJourney, question);
	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.get('/confirm-add-user', getJourneyResponse, getJourney, (req, res) =>
		list(req, res, '', {
			submitButtonText: 'Confirm',
			...addWhitelistErrors(req)
		})
	);
	router.post('/confirm-add-user', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
