import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildLandAndWorksPlansHomePage } from './controller.ts';
import { buildIsTaskCompleted } from '../util.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const landAndWorksPlansHomePage = buildLandAndWorksPlansHomePage();
	const isLandAndWorksPlansCompleted = buildIsTaskCompleted(
		service,
		applicationSectionId,
		buildLandAndWorksPlansHomePage
	);

	router.get('/', asyncHandler(landAndWorksPlansHomePage));
	router.post('/', isLandAndWorksPlansCompleted);

	return router;
}
