import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { firewallErrorPage } from './controller.ts';
import { PortalService } from '#service';

export function createErrorRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const firewallError = firewallErrorPage(service);

	router.get('/firewall-error', firewallError);

	return router;
}
