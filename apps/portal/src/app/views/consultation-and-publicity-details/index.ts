import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildConsultationAndPublicityHomePage } from './controller.ts';
import { buildIsTaskCompleted } from '../util.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const consultationAndPublicityHomePage = buildConsultationAndPublicityHomePage();
	const isConsultationAndPublicityCompleted = buildIsTaskCompleted(
		service,
		applicationSectionId,
		buildConsultationAndPublicityHomePage
	);

	router.get('/', asyncHandler(consultationAndPublicityHomePage));
	router.post('/', isConsultationAndPublicityCompleted);

	return router;
}
