import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildHomePage({ db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		try {
			await db.$queryRaw`SELECT 1`;
			logger.info('connected to database: true');
		} catch (error) {
			logger.error({ error }, 'Database connection failed');
		}

		return res.render('views/home/view.njk', {
			pageTitle: 'DCO Portal home page'
		});
	};
}
