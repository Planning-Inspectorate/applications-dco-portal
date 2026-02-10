import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildContactPage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/contact/contact.njk', {});
	};
}
