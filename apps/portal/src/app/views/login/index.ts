import { type IRouter, Router as createRouter } from 'express';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildHasApplicationReferencePage,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitHasApplicationReference,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController,
	buildTestLogin
} from './controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const hasApplicationReferencePage = buildHasApplicationReferencePage();
	const submitHasApplicationReference = buildSubmitHasApplicationReference(service);
	const enterEmailPage = buildEnterEmailPage();
	const submitEmailController = buildSubmitEmailController(service);
	const enterCodePage = buildEnterOtpPage();
	const submitOtpController = buildSubmitOtpController(service);
	const requestNewCodePage = buildRequestNewCodePage();
	const submitNewCodeRequestController = buildSubmitNewCodeRequestController(service);
	const noAccessPage = buildNoAccessPage();
	const testLogin = buildTestLogin();

	router.get('/application-reference-number', asyncHandler(hasApplicationReferencePage));
	router.post('/application-reference-number', asyncHandler(submitHasApplicationReference));
	router.get('/sign-in', asyncHandler(enterEmailPage));
	router.post('/sign-in', asyncHandler(submitEmailController));
	router.get('/enter-code', asyncHandler(enterCodePage));
	router.post('/enter-code', asyncHandler(submitOtpController));
	router.get('/request-new-code', asyncHandler(requestNewCodePage));
	router.post('/request-new-code', asyncHandler(submitNewCodeRequestController));
	router.get('/no-access', asyncHandler(noAccessPage));
	//TODO - ensure only mounted in test
	if (service.enableTestTools) router.post('/test', asyncHandler(testLogin));

	return router;
}
