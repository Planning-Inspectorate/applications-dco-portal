import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildDraftOrderAndExplanatoryMemorandumHomePage(): AsyncRequestHandler {
	return async (req, res) => {
		//TODO: update the section segment of the url to reflect created journey
		res.redirect(`${req.baseUrl}/draft-development-consent-order`);
	};
}
