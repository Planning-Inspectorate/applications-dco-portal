import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildConsultationAndPublicityHomePage(): AsyncRequestHandler {
	return async (req, res) => {
		//TODO: update the section segment of the url to reflect created journey
		res.redirect(`${req.baseUrl}/consultation-report`);
	};
}
