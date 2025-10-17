import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { createRoutes as appRoutes } from './views/home/index.ts';
import { createRoutes as loginRoutes } from './views/login/index.ts';
import { createRoutes as fileUploadRoutes } from './views/file-upload/index.ts';
import { createErrorRoutes } from './views/static/error/index.ts';
import { isUserAuthenticated, isUserUnauthenticated } from './views/middleware/auth.ts';
import { PortalService } from '#service';
import { cacheNoCacheMiddleware } from '@pins/dco-portal-lib/middleware/cache.ts';
import { createMonitoringRoutes } from '@pins/dco-portal-lib/controllers/monitoring.ts';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function buildRouter(service: PortalService): IRouter {
	const router = createRouter();

	router.use('/login', isUserUnauthenticated, loginRoutes(service));

	const monitoringRoutes = createMonitoringRoutes(service);

	router.use('/', monitoringRoutes);

	// don't cache responses, note no-cache allows some caching, but with revalidation
	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#no-cache
	router.use(cacheNoCacheMiddleware);

	// all subsequent routes will require user to be authenticated
	// place any routes that do not require user auth above here
	router.use(isUserAuthenticated);

	router.use('/', appRoutes(service));
	router.use('/error', createErrorRoutes(service));

	router.use(
		'/application-form-related-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION)
	);
	router.use('/plans-and-drawings', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS));
	router.use('/draft-dco', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.DRAFT_DCO));
	router.use(
		'/compulsory-acquisition-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION)
	);
	router.use('/consultation-report', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT));
	router.use('/reports-and-statements', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS));
	router.use('/environmental-statement', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT));
	router.use(
		'/additional-prescribed-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION)
	);
	router.use('/other-documents', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.OTHER));

	return router;
}
