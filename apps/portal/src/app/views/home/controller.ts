import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { DOCUMENT_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';

type CategoryStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

function getCategoryStatus(status: CategoryStatus): { text: string; classes: string } {
	switch (status) {
		case 'IN_PROGRESS':
			return {
				text: 'In progress',
				classes: 'govuk-tag--yellow'
			};
		case 'COMPLETED':
			return {
				text: 'Completed',
				classes: 'govuk-tag--blue'
			};
		default:
			return {
				text: 'Not yet started',
				classes: 'govuk-tag--grey'
			};
	}
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
				tag: getCategoryStatus('NOT_STARTED')
			}
		}));

		return res.render('views/home/view.njk', {
			pageTitle: 'Application reference number',
			taskListItems
		});
	};
}
