import type { AsyncRequestHandler } from '@planning-inspectorate/core/util';
import type { Request, Response } from 'express';

export function buildSessionExpiredController(): AsyncRequestHandler {
	return async (req: Request, res: Response) => {
		return res.render('views/session-expired/view.njk', {
			loginUrl: '/login/application-reference-number'
		});
	};
}
