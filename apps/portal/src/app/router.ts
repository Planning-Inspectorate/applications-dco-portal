import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import {
	createSubmissionRestrictedRoutes as submissionRestrictedAppRoutes,
	createSubmissionSafeRoutes as submissionSafeAppRoutes
} from './views/index.ts';
import { createRoutes as loginRoutes } from './views/login/index.ts';
import { createErrorRoutes } from './views/static/error/index.ts';
import { isUserAuthenticated, isUserUnauthenticated } from './views/middleware/auth.ts';
import { isApplicationCompleteMiddleware } from './views/middleware/session.ts';
import type { PortalService } from '#service';
import { cacheNoStoreMiddleware, cacheNoCacheMiddleware } from '@planning-inspectorate/core/middleware';
import { createMonitoringRoutes } from '@planning-inspectorate/core/controllers';
import { handleSessionTimeoutMiddleware, hasSessionExpired } from './views/middleware/session.ts';
import { asyncHandler } from '@planning-inspectorate/core/util';
import { buildSessionExpiredController } from './views/session-expired/controller.ts';
import { buildApplicationEnabledMiddleware } from './views/middleware/application-enabled.ts';

export function buildRouter(service: PortalService): IRouter {
	const router = createRouter();

	const applicationEnabledMiddleware = buildApplicationEnabledMiddleware(service);

	const monitoringRoutes = createMonitoringRoutes(service);

	router.use('/', monitoringRoutes);

	// don't cache responses, note no-cache allows some caching, but with revalidation
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#no-cache
	router.use(cacheNoCacheMiddleware);

	router.use(
		'/login',
		applicationEnabledMiddleware,
		// don't allow any caching for login pages
		cacheNoStoreMiddleware,
		isUserUnauthenticated,
		loginRoutes(service)
	);

	const sessionExpiredController = buildSessionExpiredController();
	router.get('/session-expired', applicationEnabledMiddleware, asyncHandler(sessionExpiredController));

	// redirect user to session timeout page if session has expired
	router.use(handleSessionTimeoutMiddleware(service));
	router.use(hasSessionExpired(service));

	// all subsequent routes will require user to be authenticated
	// place any routes that do not require user auth above here
	router.use(isUserAuthenticated);

	router.use('/', applicationEnabledMiddleware, submissionSafeAppRoutes(service));

	// all subsequent routes require an incomplete application
	// if the application is complete, any routes here will redirect to the application complete page
	router.use(
		'/',
		applicationEnabledMiddleware,
		isApplicationCompleteMiddleware,
		submissionRestrictedAppRoutes(service)
	);

	router.use('/error', applicationEnabledMiddleware, createErrorRoutes(service));

	return router;
}
