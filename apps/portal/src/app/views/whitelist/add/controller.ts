import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { JOURNEY_ID } from './journey.ts';
import { addSessionData } from '@pins/dco-portal-lib/util/session.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { TEAM_EMAIL_ADDRESS } from '@pins/dco-portal-lib/govnotify/constants.ts';

export function buildSaveController({ db, logger, notifyClient }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { caseReference } = req.session;
		if (!caseReference) {
			return notFoundHandler(req, res);
		}

		const answers = getAnswersFromRes(res);

		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: {
				caseReference_email: {
					caseReference,
					email: answers.emailAddress
				}
			}
		});

		if (whitelistUser) {
			const error = [
				{
					text: 'You are trying to add a user who already exists on the whitelist',
					href: '#'
				}
			];
			addSessionData(req, caseReference, { whitelistError: error });
			return res.redirect(`${req.baseUrl}/confirm-add-user`);
		}

		const adminUserCount = await db.whitelistUser.count({
			where: {
				caseReference,
				caseId: caseData.id,
				userRoleId: WHITELIST_USER_ROLE_ID.ADMIN_USER
			}
		});

		if (adminUserCount >= 3 && answers.accessLevel === WHITELIST_USER_ROLE_ID.ADMIN_USER) {
			const error = [
				{
					text: 'There can only be 3 admins, select standard or change another user’s access level',
					href: '#'
				}
			];
			addSessionData(req, caseReference, { whitelistError: error });
			return res.redirect(`${req.baseUrl}/confirm-add-user`);
		}

		try {
			await db.$transaction(async ($tx) => {
				await $tx.whitelistUser.create({
					data: {
						caseReference,
						email: answers.emailAddress,
						UserRole: {
							connect: {
								id: answers.accessLevel
							}
						},
						Case: {
							connect: {
								id: caseData.id
							}
						}
					}
				});
			});
		} catch (error) {
			logger.error({ error }, 'error adding new user to the whitelist');
			throw new Error('error adding new user');
		}

		await notifyClient?.sendWhitelistAddNotification(answers.emailAddress, {
			case_reference_number: caseReference,
			relevant_team_email_address: TEAM_EMAIL_ADDRESS
		});

		addSessionData(req, req.session.caseReference as string, {
			whitelistUpdateMessage: `<p class="govuk-notification-banner__heading">${answers.emailAddress} as been added to the project</p><p class="govuk-body">They will get an email with a link to the service.</p>`
		});

		clearDataFromSession({ req, journeyId: JOURNEY_ID });
		res.redirect('/manage-users');
	};
}
