import { Router as createRouter } from 'express';
import { createMonitoringRoutes } from '@pins/dco-portal-lib/controllers/monitoring.js';
import { createRoutes as appRoutes } from './views/home/index.js';
import { createErrorRoutes } from './views/static/error/index.js';
import { cacheNoCacheMiddleware } from '@pins/dco-portal-lib/middleware/cache.js';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController
} from './views/login/controller.js';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.js';

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Router}
 */
export function buildRouter(service) {
	const router = createRouter();
	const monitoringRoutes = createMonitoringRoutes(service);

	const enterEmailPage = buildEnterEmailPage();
	const submitEmailController = buildSubmitEmailController(service);
	const enterCodePage = buildEnterOtpPage();
	const submitOtpController = buildSubmitOtpController(service);
	const requestNewCodePage = buildRequestNewCodePage();
	const submitNewCodeRequestController = buildSubmitNewCodeRequestController();
	const noAccessPage = buildNoAccessPage();

	router.use('/', monitoringRoutes);

	// don't cache responses, note no-cache allows some caching, but with revalidation
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#no-cache
	router.use(cacheNoCacheMiddleware);

	router.use('/', appRoutes(service));
	router.use('/error', createErrorRoutes(service));

	// login routes
	router.get('/email-address', asyncHandler(enterEmailPage));
	router.post('/email-address', asyncHandler(submitEmailController));
	router.get('/enter-code', asyncHandler(enterCodePage));
	router.post('/enter-code', asyncHandler(submitOtpController));
	router.get('/request-new-code', asyncHandler(requestNewCodePage));
	router.post('/request-new-code', asyncHandler(submitNewCodeRequestController));
	router.get('/no-access', asyncHandler(noAccessPage));

	return router;
}
