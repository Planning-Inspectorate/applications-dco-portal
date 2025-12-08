import { Router as createRouter } from 'express';
import type { Handler, Request } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { buildSave, list, question } from '@planning-inspectorate/dynamic-forms/src/controller.js';
// @ts-expect-error - due to not having @types
import validate from '@planning-inspectorate/dynamic-forms/src/validator/validator.js';
// @ts-expect-error - due to not having @types
import { validationErrorHandler } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import {
	buildGetJourneyResponseFromSession,
	saveDataToSession
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { buildSaveController } from './controller.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { buildGetJourney } from '@planning-inspectorate/dynamic-forms/src/middleware/build-get-journey.js';
import { createJourney, JOURNEY_ID } from './journey.ts';
import { buildGetWhitelistUserEmailAddress } from '../../middleware/whitelist-middleware.ts';
import { addWhitelistErrors, shouldShowWarningBanner } from '../util.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions();
	const getJourney = buildGetJourney((req: Request, journeyResponse: Handler) =>
		createJourney(questions, journeyResponse, req)
	);
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
