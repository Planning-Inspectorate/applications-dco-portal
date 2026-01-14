import type { NextFunction, Request, Response } from 'express';
import { PortalService } from '#service';
import { RedisClient } from '@pins/dco-portal-lib/redis/redis-client.ts';

export function handleSessionTimeoutMiddleware(service: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { logger, redisClient } = service;

		if (!redisClient) {
			return next();
		}

		await clearSessionJourneysMiddleware(redisClient, req.sessionID);

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

export function someoneElseEditingJourneyMiddleware(service: PortalService, journeyName: string) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { redisClient } = service;

		if (!redisClient) {
			return next();
		}

		const journeyKey = `journey:${journeyName}:active`;

		await redisClient.zAdd(journeyKey, Date.now(), req.sessionID);
		await redisClient.zRemRangeByScore(journeyKey, 0, Date.now() - 60000);
		await redisClient.expire(journeyKey, 120);

		const sessionJourneysKey = `session:${req.sessionID}:journeys`;

		await redisClient.sAdd(sessionJourneysKey, journeyName);
		await redisClient.expire(sessionJourneysKey, 60 * 30);

		const count = await redisClient.zCard(journeyKey);
		res.locals.showJourneyBanner = count > 1;

		return next();
	};
}

export function removeIsEditingJourneyMiddleware(service: PortalService, journeyName: string) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { redisClient } = service;

		if (!redisClient) {
			return next();
		}

		const journeyKey = `journey:${journeyName}:active`;
		await redisClient.zRem(journeyKey, req.sessionID);

		const sessionJourneysKey = `session:${req.sessionID}:journeys`;
		await redisClient.sRem(sessionJourneysKey, journeyName);

		return next();
	};
}

export function cleanupSessionJourneyMiddleware(service: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { redisClient } = service;

		if (!redisClient) {
			return next();
		}

		await clearSessionJourneysMiddleware(redisClient, req.sessionID);

		next();
	};
}

async function clearSessionJourneysMiddleware(redisClient: RedisClient, sessionID: string) {
	const sessionJourneysKey = `session:${sessionID}:journeys`;
	const journeys = await redisClient.sMembers(sessionJourneysKey);

	for (const journeyName of journeys) {
		const journeyKey = `journey:${journeyName}:active`;
		await redisClient.zRem(journeyKey, sessionID);
	}

	await redisClient.del(sessionJourneysKey);
}
