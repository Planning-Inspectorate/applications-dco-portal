/**
 * @param {import('#service').App1Service} service
 * @returns {import('express').Handler}
 */
export function buildHomePage({ db, logger }) {
	return async (req, res) => {
		let connected = false;
		try {
			await db.$queryRaw`SELECT 1`;
			connected = true;
			logger.info(`connected to database: ${connected}`);
		} catch (error) {
			logger.error('Database connection failed', error);
		}

		req.session.visits = (req.session.visits || 0) + 1;
		logger.info('DCO Portal: rendering home page');
		return res.render('views/home/view.njk', {
			pageTitle: 'DCO Portal home page',
			visitCount: req.session.visits
		});
	};
}
