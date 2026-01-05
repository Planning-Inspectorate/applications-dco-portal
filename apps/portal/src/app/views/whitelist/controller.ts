import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { clearSessionData, readSessionData } from '@pins/dco-portal-lib/util/session.ts';

export function buildWhitelistHomePage({ db }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { emailAddress, caseReference } = req.session;

		if (!emailAddress || !caseReference) {
			return notFoundHandler(req, res);
		}

		const whiteListUsers = await db.whitelistUser.findMany({
			where: { caseReference },
			include: {
				UserRole: true
			},
			orderBy: [{ isInitialInvitee: 'desc' }, { userRoleId: 'desc' }]
		});

		const userRows = whiteListUsers.map((user) => {
			const { id, email, isInitialInvitee, UserRole } = user;
			return [
				{ html: `<b>${email}</b>` },
				{ text: UserRole.displayName },
				{
					html: isInitialInvitee
						? ''
						: `<a class="govuk-link govuk-link--no-visited-state" href="${req.baseUrl}/${id}/edit-user/user/access-level">Edit</a>`
				},
				{
					html: isInitialInvitee
						? ''
						: `<a class="govuk-link govuk-link--no-visited-state" href="${req.baseUrl}/${id}/remove-user">Remove</a>`
				}
			];
		});

		const whitelistUpdateMessage = readSessionData(
			req,
			req.session.caseReference as string,
			'whitelistUpdateMessage',
			false
		);
		clearSessionData(req, req.session.caseReference as string, 'whitelistUpdateMessage');

		return res.render('views/whitelist/view.njk', {
			pageTitle: 'Manage users of this project',
			backLinkUrl: '/',
			addUserLink: `${req.baseUrl}/add-user/user/email-address`,
			whitelistUpdateMessage,
			users: userRows
		});
	};
}
