import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { WHITELIST_USER_ROLE, WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { addSessionData } from '@pins/dco-portal-lib/util/session.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { JOURNEY_ID } from './journey.ts';
import { TEAM_EMAIL_ADDRESS } from '@pins/dco-portal-lib/govnotify/gov-notify-client.ts';

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

		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const answers = getAnswersFromRes(res);

		const adminUserCount = await db.whitelistUser.count({
			where: {
				caseReference,
				caseId: caseData.id,
				userRoleId: WHITELIST_USER_ROLE_ID.ADMIN_USER,
				id: { not: whitelistUserId }
			}
		});

		if (adminUserCount >= 3 && answers.accessLevel === WHITELIST_USER_ROLE_ID.ADMIN_USER) {
			const error = [
				{
					text: 'You are trying to assign admin rights to a user when there are already a maximum of 3',
					href: '#'
				}
			];
			addSessionData(req, caseReference, { whitelistError: error });
			return res.redirect(`${req.baseUrl}/confirm-changes`);
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
			await db.whitelistUser.update({
				where: {
					id: whitelistUserId,
					caseReference,
					caseId: caseData.id
				},
				data: {
					UserRole: {
						connect: {
							id: answers.accessLevel
						}
					}
				}
			});
		} catch (error) {
			logger.error({ error }, 'error editing whitelist user');
			throw new Error('error editing user');
		}

		if (answers.accessLevel !== whitelistUser.userRoleId) {
			notifyClient?.sendWhitelistAccessChangedNotification(whitelistUser.email, {
				case_reference_number: caseReference,
				type_of_user_changed_from:
					WHITELIST_USER_ROLE.find((r) => r.id === whitelistUser.userRoleId)?.displayName ?? '',
				type_of_user_changed_to: WHITELIST_USER_ROLE.find((r) => r.id === answers.accessLevel)?.displayName ?? '',
				relevant_team_email_address: TEAM_EMAIL_ADDRESS
			});
		}

		const messageHeading = `${req.session.editUserEmailAddress} is now ${answers.accessLevel === WHITELIST_USER_ROLE_ID.ADMIN_USER ? 'an admin' : 'a standard user'}`;
		const messageBody =
			answers.accessLevel === WHITELIST_USER_ROLE_ID.ADMIN_USER
				? 'They can now manage user access on this project.'
				: 'They can no longer manage user access on this project.';
		addSessionData(req, req.session.caseReference as string, {
			whitelistUpdateMessage: `<p class="govuk-notification-banner__heading">${messageHeading}</p><p class="govuk-body">${messageBody}</p>`
		});

		delete req.session.editUserEmailAddress;
		clearDataFromSession({ req, journeyId: JOURNEY_ID });
		res.redirect('/manage-users');
	};
}
