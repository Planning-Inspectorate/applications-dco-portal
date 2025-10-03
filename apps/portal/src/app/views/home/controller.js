/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Handler}
 */
export function buildHomePage({ db, logger }) {
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
