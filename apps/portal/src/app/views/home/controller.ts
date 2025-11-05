import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import {
	DOCUMENT_CATEGORY,
	DOCUMENT_CATEGORY_STATUS,
	DOCUMENT_CATEGORY_STATUS_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION } from '../constants.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';

export function buildHomePage({ db }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { emailAddress, caseReference } = req.session;

		if (!emailAddress || !caseReference) {
			return notFoundHandler(req, res);
		}

		const caseData = await db.case.upsert({
			where: { reference: caseReference },
			update: {},
			create: { reference: caseReference, email: emailAddress }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const taskListItems = {
			yourDocuments: formatTaskListItems(caseData, DOCUMENT_CATEGORY),
			yourApplication: formatTaskListItems(caseData, APPLICATION_SECTION)
		};

		return res.render('views/home/view.njk', {
			pageTitle: 'Application reference number',
			taskListItems
		});
	};
}

function getCategoryStatus(statusId: string): { text: string; classes: string } {
	const status = DOCUMENT_CATEGORY_STATUS.find((s) => s.id === statusId);

	const statusMap: Record<string, string> = {
		[DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED]: 'govuk-tag--grey',
		[DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS]: 'govuk-tag--yellow',
		[DOCUMENT_CATEGORY_STATUS_ID.COMPLETED]: 'govuk-tag--blue'
	};

	return {
		text: status?.displayName || 'Not yet started',
		classes: statusMap[statusId] || 'govuk-tag--grey'
	};
}

function formatTaskListItems(caseData: any, taskList: { id: string; displayName: string }[]) {
	return taskList.map((subtask) => ({
		title: {
			text: subtask.displayName,
			classes: 'govuk-link--no-visited-state'
		},
		href: `/${subtask.id}`,
		status: {
			tag: getCategoryStatus((caseData as any)[`${kebabCaseToCamelCase(subtask.id)}StatusId`])
		}
	}));
}
