import type { NextFunction, Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { PortalService } from '#service';

export function buildApplicationEnabledMiddleware({ isApplicationEnabled }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!isApplicationEnabled) {
			return notFoundHandler(req, res);
		} else {
			next();
		}
	};
}
