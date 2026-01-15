import type { Request, Response } from 'express';
import type { PortalService } from '#service';
import { promisify } from 'node:util';

export function buildSignOutController({ logger, redisClient }: PortalService) {
	return async (req: Request, res: Response) => {
		await redisClient?.del(`sess:${req.sessionID}`);
		await redisClient?.del(`user_session:${req.session.emailAddress}`);

		const sessionId = req.session.id;
		await promisify(req.session.destroy.bind(req.session))();

		logger.info({ sessionId }, 'clearing session:');

		res
			.setHeader('Clear-Site-Data', '*')
			.clearCookie('connect.sid', { path: '/' })
			.clearCookie('had-session', { path: '/' })
			.redirect('/login/application-reference-number');
	};
}
