import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import {
	DOCUMENT_CATEGORY,
	DOCUMENT_CATEGORY_STATUS,
	DOCUMENT_CATEGORY_STATUS_ID,
	WHITELIST_USER_ROLE_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION } from '../constants.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';

export function buildHomePage({ db }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { emailAddress, caseReference } = req.session;

		if (!emailAddress || !caseReference) {
			return notFoundHandler(req, res);
		}

		const caseData = await db.case.findUnique({
			where: { reference: caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		const whitelistUser = await db.whitelistUser.findUnique({
			where: {
				caseReference_email: {
					caseReference,
					email: emailAddress
				}
			}
		});

		if (!whitelistUser) {
			return notFoundHandler(req, res);
		}

		const taskListItems = {
			yourDocuments: formatTaskListItems(caseData, DOCUMENT_CATEGORY),
			yourApplication: formatTaskListItems(caseData, APPLICATION_SECTION)
		};

		const { submissionText, warningText, enableSubmissionButton } = getSubmissionDateContent(
			caseData.anticipatedDateOfSubmission
		);

		return res.render('views/home/view.njk', {
			pageTitle: req.session.caseReference,
			taskListItems,
			showManageUsersLink: whitelistUser.userRoleId === WHITELIST_USER_ROLE_ID.ADMIN_USER,
			submissionText,
			warningText,
			enableSubmissionButton,
			hasCaseBeenSubmitted: caseData.submissionDate !== null
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

function getSubmissionDateContent(anticipatedDateOfSubmission: Date | null): {
	submissionText: string;
	warningText: string;
	enableSubmissionButton: boolean;
} {
	const now = new Date();
	const dayAfterTomorrow = new Date();
	dayAfterTomorrow.setDate(now.getDate() + 2);

	if (!anticipatedDateOfSubmission) {
		return {
			submissionText: '',
			warningText: '',
			enableSubmissionButton: false
		};
	} else if (anticipatedDateOfSubmission < now) {
		return {
			submissionText: `<h2 class="govuk-heading-m">You will be able to submit you application on ${formatDateForDisplay(anticipatedDateOfSubmission)}</h2><p class="govuk-body">Once the applications is submitted, it will be locked and you can make no further changes.</p>`,
			warningText: `If you miss this date, you'll need to agree a new submission date with the Planning Inspectorate`,
			enableSubmissionButton: false
		};
	} else if (anticipatedDateOfSubmission < dayAfterTomorrow) {
		return {
			submissionText: `<h2 class="govuk-heading-m">Now submit your application</h2><p class="govuk-body">You can now submit your application. Once the application is submitted, it will be locked and you can make no further changes.</p>`,
			warningText: `If you do not submit your application today, you'll need to agree a new submission date with the Planning Inspectorate`,
			enableSubmissionButton: true
		};
	} else {
		return {
			submissionText: `<h2 class="govuk-heading-m">Your submission date has passed</h2>`,
			warningText: `You can continue working on your application, but you cannot submit it at this time. To submit, you must contact the Planning Inspectorate to agree a new submission date.`,
			enableSubmissionButton: false
		};
	}
}
