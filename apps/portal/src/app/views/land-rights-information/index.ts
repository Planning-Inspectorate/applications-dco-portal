import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildLandRightsInformationHomePage } from './controller.ts';
import { buildIsTaskCompleted } from '../util.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const landRightsInformationHomePage = buildLandRightsInformationHomePage();
	const isLandRightsInformationCompleted = buildIsTaskCompleted(
		service,
		applicationSectionId,
		buildLandRightsInformationHomePage
	);

	router.get('/', asyncHandler(landRightsInformationHomePage));
	router.post('/', isLandRightsInformationCompleted);

	return router;
}
