import { Router as createRouter } from 'express';
import { buildHomePage } from './controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';
import type { IRouter } from 'express';

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Router}
 */
export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const homePageController = buildHomePage(service);
	router.get('/', asyncHandler(homePageController));

	return router;
}
