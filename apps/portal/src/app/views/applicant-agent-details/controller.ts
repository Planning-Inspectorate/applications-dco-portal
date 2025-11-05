import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildApplicantAgentDetailsHomePage(): AsyncRequestHandler {
	return async (req, res) => {
		res.redirect(`${req.baseUrl}/application/organisation`);
	};
}
