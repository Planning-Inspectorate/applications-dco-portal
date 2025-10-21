import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { DOCUMENT_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryStatus(_categoryId: string): { text: string; classes: string } {
	return {
		text: 'Not yet started',
		classes: 'govuk-tag--grey'
	};
}

export function buildHomePage({ db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		try {
			await db.$queryRaw`SELECT 1`;
			logger.info('connected to database: true');
		} catch (error) {
			logger.error({ error }, 'Database connection failed');
		}

		const taskListItems = DOCUMENT_CATEGORY.map((category) => ({
			title: {
				text: category.displayName
			},
			href: `/${category.id}`,
			status: {
				tag: getCategoryStatus(category.id)
			}
		}));

		return res.render('views/home/view.njk', {
			pageTitle: 'Application reference number',
			taskListItems
		});
	};
}
