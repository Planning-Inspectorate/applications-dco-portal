import type { NextFunction, Request, Response } from 'express';
import { PortalService } from '#service';

export function handleSessionTimeoutMiddleware({ logger }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userHadSessionBefore = req.cookies['had-session'];
		if (!req.session?.isAuthenticated && userHadSessionBefore) {
			res.clearCookie('connect.sid', { path: '/' });
			res.clearCookie('had-session', { path: '/' });

			logger.info(
				{ sessionId: req.sessionID, emailAddress: req.session?.emailAddress },
				'Session timed out due to inactivity'
			);

			return res.redirect('/session-expired');
		}
		next();
	};
}
