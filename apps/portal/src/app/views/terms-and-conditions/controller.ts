import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildTermsAndConditionsPage(): AsyncRequestHandler {
	return async (_req, res) => {
		return res.render('views/terms-and-conditions/terms-and-conditions.njk', {});
	};
}
