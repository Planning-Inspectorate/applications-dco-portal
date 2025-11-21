import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildLandAndWorksPlansHomePage(): AsyncRequestHandler {
	return async (req, res) => {
		//TODO: update the section segment of the url to reflect created journey
		res.redirect(`${req.baseUrl}/land-plan`);
	};
}
