import { Router as createRouter } from 'express';
import { createMonitoringRoutes } from '@pins/dco-portal-lib/controllers/monitoring.js';
import { createRoutes as appRoutes } from './views/home/index.js';
import { createRoutes as loginRoutes } from './views/login/index.js';
import { createErrorRoutes } from './views/static/error/index.js';
import { cacheNoCacheMiddleware } from '@pins/dco-portal-lib/middleware/cache.js';
import { isAuthenticated } from './views/middleware/auth.js';

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Router}
 */
export function buildRouter(service) {
	const router = createRouter();

	router.use('/login', loginRoutes(service));

	const monitoringRoutes = createMonitoringRoutes(service);

	router.use('/', monitoringRoutes);

	// don't cache responses, note no-cache allows some caching, but with revalidation
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#no-cache
	router.use(cacheNoCacheMiddleware);

	// all subsequent routes will require user to be authenticated
	// place any routes that do not require user auth above here
	router.use(isAuthenticated);

	router.use('/', appRoutes(service));
	router.use('/error', createErrorRoutes(service));

	return router;
}
