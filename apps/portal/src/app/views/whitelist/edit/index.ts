import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
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
import { buildGetWhitelistUserEmailAddress } from '../../middleware/whitelist-middleware.ts';
import { addWhitelistErrors, shouldShowWarningBanner } from '../util.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req, journeyResponse) => createJourney(questions, journeyResponse, req));
	const getJourneyResponse = buildGetJourneyResponseFromSession(JOURNEY_ID);

	const saveController = buildSaveController(service);

	const getWhitelistUserEmailAddress = buildGetWhitelistUserEmailAddress(service);

	router.get('/:section/:question', getJourneyResponse, getJourney, question);
	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.get('/confirm-changes', getJourneyResponse, getJourney, getWhitelistUserEmailAddress, (req, res) =>
		list(req, res, '', {
			emailAddress: req.session.editUserEmailAddress,
			shouldShowWarningBanner: shouldShowWarningBanner(req, res),
			submitButtonText: 'Confirm',
			...addWhitelistErrors(req)
		})
	);
	router.post('/confirm-changes', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
