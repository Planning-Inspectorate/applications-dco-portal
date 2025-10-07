import { type IRouter, Router as createRouter } from 'express';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController
} from './controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const enterEmailPage = buildEnterEmailPage();
	const submitEmailController = buildSubmitEmailController(service);
	const enterCodePage = buildEnterOtpPage();
	const submitOtpController = buildSubmitOtpController(service);
	const requestNewCodePage = buildRequestNewCodePage();
	const submitNewCodeRequestController = buildSubmitNewCodeRequestController(service);
	const noAccessPage = buildNoAccessPage();

	router.get('/email-address', asyncHandler(enterEmailPage));
	router.post('/email-address', asyncHandler(submitEmailController));
	router.get('/enter-code', asyncHandler(enterCodePage));
	router.post('/enter-code', asyncHandler(submitOtpController));
	router.get('/request-new-code', asyncHandler(requestNewCodePage));
	router.post('/request-new-code', asyncHandler(submitNewCodeRequestController));
	router.get('/no-access', asyncHandler(noAccessPage));

	return router;
}
