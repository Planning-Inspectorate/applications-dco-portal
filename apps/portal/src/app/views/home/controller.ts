import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import {
	DOCUMENT_CATEGORY,
	CATEGORY_STATUS,
	CATEGORY_STATUS_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';

function getCategoryStatus(statusId: string): { text: string; classes: string } {
	const status = CATEGORY_STATUS.find((s) => s.id === statusId);

	const classMap: Record<string, string> = {
		[CATEGORY_STATUS_ID.NOT_STARTED]: 'govuk-tag--grey',
		[CATEGORY_STATUS_ID.IN_PROGRESS]: 'govuk-tag--yellow',
		[CATEGORY_STATUS_ID.COMPLETED]: 'govuk-tag--blue'
	};

	return {
		text: status?.displayName || 'Not yet started',
		classes: classMap[statusId] || 'govuk-tag--grey'
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
				tag: getCategoryStatus(CATEGORY_STATUS_ID.NOT_STARTED)
			}
		}));

		return res.render('views/home/view.njk', {
			pageTitle: 'Application reference number',
			taskListItems
		});
	};
}
