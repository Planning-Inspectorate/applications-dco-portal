import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildDraftOrderAndExplanatoryMemorandumHomePage } from './controller.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const applicantAgentDetailsHomePage = buildDraftOrderAndExplanatoryMemorandumHomePage();

	router.get('/', asyncHandler(applicantAgentDetailsHomePage));

	return router;
}
