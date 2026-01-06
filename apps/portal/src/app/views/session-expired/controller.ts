import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { Request, Response } from 'express';

export function buildSessionExpiredController(): AsyncRequestHandler {
	return async (req: Request, res: Response) => {
		return res.render('views/session-expired/view.njk', {
			loginUrl: '/login/application-reference-number'
		});
	};
}
