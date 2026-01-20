import type { NextFunction, Request, Response } from 'express';
import { PortalService } from '#service';
import { RedisClient } from '@pins/dco-portal-lib/redis/redis-client.ts';
import { promisify } from 'node:util';

export function handleSessionTimeoutMiddleware(service: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { logger, redisClient } = service;

		if (!redisClient) {
			return next();
		}

		const userHadSessionBefore = req.cookies['had-session'];
		if (!req.session?.isAuthenticated && userHadSessionBefore) {
			await redisClient?.del(`sess:${req.sessionID}`);
			await redisClient?.del(`user_session:${req.session.emailAddress}`);
			await clearSessionJourneysMiddleware(redisClient, req.sessionID);

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

export function hasSessionExpired(service: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { logger, redisClient } = service;

		if (!redisClient) {
			return next();
		}

		if (!req.session || !req.session.emailAddress) {
			return next();
		}

		if (req.session.isAuthenticated) {
			const key = `user_session:${req.session.emailAddress}`;
			const activeSessionId = await redisClient.get(key);

			if (activeSessionId !== req.sessionID) {
				await redisClient?.del(`sess:${req.sessionID}`);
				await redisClient?.del(`user_session:${req.session.emailAddress}`);

				const sessionId = req.session.id;
				await promisify(req.session.destroy.bind(req.session))();

				logger.info({ sessionId }, 'clearing session as no longer active user session:');

				return res
					.setHeader('Clear-Site-Data', '*')
					.clearCookie('connect.sid', { path: '/' })
					.clearCookie('had-session', { path: '/' })
					.redirect('/session-expired');
			}
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

export function hasApplicationBeenSubmittedMiddleware({ db }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session.caseReference }
		});

		const isToday = (d: Date) => new Date(d).toDateString() === new Date().toDateString();

		const isTomorrow = (d: Date) => {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);

			return new Date(d).toDateString() === tomorrow.toDateString();
		};

		const canSubmitApplication =
			caseData?.anticipatedDateOfSubmission &&
			(isToday(caseData?.anticipatedDateOfSubmission) || isTomorrow(caseData?.anticipatedDateOfSubmission));

		if (caseData?.submissionDate === null && canSubmitApplication) {
			return next();
		}

		res.redirect('/');
	};
}
