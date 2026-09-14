import type { AsyncRequestHandler } from '@planning-inspectorate/core/util';

export function buildTermsAndConditionsPage(): AsyncRequestHandler {
	return async (_req, res) => {
		return res.render('views/terms-and-conditions/terms-and-conditions.njk', {});
	};
}
