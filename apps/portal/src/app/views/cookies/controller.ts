import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildCookiesPage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/cookies/cookies.njk', {});
	};
}
