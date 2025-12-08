import { Router as createRouter } from 'express';
import type { IRouter } from 'express';
import type { PortalService } from '#service';
import { buildRemoveUserPage, buildSaveController } from './controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const whitelistHomePage = buildRemoveUserPage(service);
	const saveController = buildSaveController(service);

	router.get('/', asyncHandler(whitelistHomePage));
	router.post('/', asyncHandler(saveController));

	return router;
}
