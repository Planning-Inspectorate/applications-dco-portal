import { Router as createRouter } from 'express';
import type { IRouter } from 'express';
import type { PortalService } from '#service';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildWhitelistHomePage } from './controller.ts';
import { createRoutes as addUserRoutes } from './add/index.ts';
import { createRoutes as editUserRoutes } from './edit/index.ts';
import { createRoutes as removeUserRoutes } from './remove/index.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const whitelistHomePage = buildWhitelistHomePage(service);

	router.get('/', asyncHandler(whitelistHomePage));

	router.use('/add-user', addUserRoutes(service));
	router.use('/:whitelistUserId/edit-user', editUserRoutes(service));
	router.use('/:whitelistUserId/remove-user', removeUserRoutes(service));

	return router;
}
