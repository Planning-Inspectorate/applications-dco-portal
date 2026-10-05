import type { AsyncRequestHandler } from '@planning-inspectorate/core/util';

export function buildContactPage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/contact/contact.njk', {});
	};
}
