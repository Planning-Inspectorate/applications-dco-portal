import { PortalService } from '#service';
import type { NextFunction, Request, Response } from 'express';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';

export function buildWhitelistMiddleware({ db }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { emailAddress, caseReference } = req.session;

		if (!emailAddress || !caseReference) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: {
				caseReference_email: {
					caseReference,
					email: emailAddress
				}
			}
		});

		if (!whitelistUser) {
			return notFoundHandler(req, res);
		}

		if (whitelistUser.userRoleId === WHITELIST_USER_ROLE_ID.ADMIN_USER) {
			return next();
		}
		res.redirect('/');
	};
}

export function buildGetWhitelistUserEmailAddress({ db }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { whitelistUserId } = req.params;
		if (!whitelistUserId) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: { id: whitelistUserId }
		});

		if (!whitelistUser) {
			return notFoundHandler(req, res);
		}

		req.session.editUserEmailAddress = whitelistUser.email;

		next();
	};
}
