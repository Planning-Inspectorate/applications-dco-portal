import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildAboutTheProjectHomePage } from './controller.ts';
import { buildIsTaskCompleted } from '../util.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const aboutTheProjectHomePage = buildAboutTheProjectHomePage();
	const isAboutTheProjectCompleted = buildIsTaskCompleted(service, applicationSectionId, buildAboutTheProjectHomePage);

	router.get('/', asyncHandler(aboutTheProjectHomePage));
	router.post('/', isAboutTheProjectCompleted);

	return router;
}
