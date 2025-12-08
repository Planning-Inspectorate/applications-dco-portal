import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import type { Request, Response } from 'express';
import { clearSessionData, readSessionData } from '@pins/dco-portal-lib/util/session.ts';

export const USER_ROLES = [
	{
		id: WHITELIST_USER_ROLE_ID.STANDARD_USER,
		displayName: 'Standard',
		hint: {
			text: 'Can view and interact with the application'
		}
	},
	{
		id: WHITELIST_USER_ROLE_ID.ADMIN_USER,
		displayName: 'Admin',
		hint: {
			text: 'Can also add and remove users'
		}
	}
];

export function shouldShowWarningBanner(req: Request, res: Response) {
	const answers = getAnswersFromRes(res);
	return (
		req.session.editUserEmailAddress === req.session.emailAddress &&
		answers.accessLevel === WHITELIST_USER_ROLE_ID.STANDARD_USER
	);
}

export const addWhitelistErrors = (req: Request) => {
	const { caseReference } = req.session;
	const errors: any = readSessionData(req, caseReference as string, 'whitelistError', [], 'cases');
	if (errors.length > 0) {
		const whitelistErrors = {
			errors: errors,
			errorSummary: errors
		};
		clearSessionData(req, caseReference as string, 'whitelistError', 'cases');
		return whitelistErrors;
	}
};
