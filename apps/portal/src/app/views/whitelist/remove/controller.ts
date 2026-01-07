import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { addSessionData } from '@pins/dco-portal-lib/util/session.ts';
import { TEAM_EMAIL_ADDRESS } from '@pins/dco-portal-lib/govnotify/gov-notify-client.ts';

export function buildRemoveUserPage({ db }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { whitelistUserId } = req.params;
		if (!whitelistUserId) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: { id: whitelistUserId },
			include: {
				UserRole: true
			}
		});

		if (!whitelistUser) {
			return notFoundHandler(req, res);
		}

		return res.render('views/whitelist/remove/view.njk', {
			pageTitle: 'Are you sure you want to remove this user?',
			backLinkUrl: '/manage-users',
			emailAddress: whitelistUser.email,
			accessLevel: whitelistUser.UserRole.displayName
		});
	};
}

export function buildSaveController({ db, logger, notifyClient }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { whitelistUserId } = req.params;
		if (!whitelistUserId) {
			return notFoundHandler(req, res);
		}

		const { caseReference } = req.session;
		if (!caseReference) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: { id: whitelistUserId },
			include: {
				UserRole: true
			}
		});

		if (!whitelistUser) {
			return notFoundHandler(req, res);
		}

		try {
			await db.whitelistUser.delete({
				where: { id: whitelistUserId }
			});
		} catch (error) {
			logger.error({ error }, `error removing whitelist user id ${whitelistUserId} from the database`);
			throw new Error('error removing user from the whitelist');
		}

		notifyClient?.sendWhitelistRemoveNotification(whitelistUser.email, {
			case_reference_number: caseReference,
			relevant_team_email_address: TEAM_EMAIL_ADDRESS
		});

		addSessionData(req, req.session.caseReference as string, {
			whitelistUpdateMessage: `<p class="govuk-notification-banner__heading">${whitelistUser.email} has been removed from the project</p><p class="govuk-body">They will no longer be able to access the service</p>`
		});

		res.redirect('/manage-users');
	};
}
