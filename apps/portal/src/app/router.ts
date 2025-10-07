import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { createRoutes as appRoutes } from './views/home/index.ts';
import { createRoutes as loginRoutes } from './views/login/index.ts';
import { createErrorRoutes } from './views/static/error/index.ts';
import { isAuthenticated } from './views/middleware/auth.ts';
import { PortalService } from '#service';
import { cacheNoCacheMiddleware } from '@pins/dco-portal-lib/middleware/cache.ts';
import { createMonitoringRoutes } from '@pins/dco-portal-lib/controllers/monitoring.ts';

export function buildRouter(service: PortalService): IRouter {
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
