import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildAboutTheProjectHomePage(): AsyncRequestHandler {
	return async (req, res) => {
		res.redirect(`${req.baseUrl}/about/consent-reason`);
	};
}
