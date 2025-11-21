import { Router as createRouter } from 'express';
import type { IRouter } from 'express';

import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildDraftOrderAndExplanatoryMemorandumHomePage } from './controller.ts';
import { buildIsTaskCompleted } from '../util.ts';

export function createRoutes(service: PortalService, applicationSectionId: string): IRouter {
	const router = createRouter({ mergeParams: true });

	const draftOrderAndExplanatoryMemorandumHomePage = buildDraftOrderAndExplanatoryMemorandumHomePage();
	const isDraftOrderAndExplanatoryMemorandumCompleted = buildIsTaskCompleted(
		service,
		applicationSectionId,
		buildDraftOrderAndExplanatoryMemorandumHomePage
	);

	router.get('/', asyncHandler(draftOrderAndExplanatoryMemorandumHomePage));
	router.post('/', isDraftOrderAndExplanatoryMemorandumCompleted);

	return router;
}
