import type { AsyncRequestHandler } from '@planning-inspectorate/core/util';

export function buildCookiesPage(): AsyncRequestHandler {
	return async (_req, res) => {
		return res.render('views/cookies/cookies.njk', {});
	};
}
