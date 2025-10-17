import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';
import type { IRouter } from 'express';
import { buildFileUploadHomePage } from './controller.ts';

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Router}
 */
export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const fileUploadHomePage = buildFileUploadHomePage(service);
	router.get('/', asyncHandler(fileUploadHomePage));

	return router;
}
