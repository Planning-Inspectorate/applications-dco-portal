import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import {
	DOCUMENT_CATEGORY,
	DOCUMENT_CATEGORY_ID,
	DOCUMENT_CATEGORY_STATUS,
	DOCUMENT_CATEGORY_STATUS_ID,
	WHITELIST_USER_ROLE_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION, APPLICATION_SECTION_ID } from '../constants.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';

const optionalSections: string[] = [
	DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION,
	DOCUMENT_CATEGORY_ID.OTHER,
	APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
];

export function buildHomePage({ db }: PortalService, viewData = {}): AsyncRequestHandler {
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

		const { submissionText, warningText, submissionInformation, enableSubmissionButton } = getSubmissionDateContent(
			caseData.anticipatedDateOfSubmission
		);

		return res.render('views/home/view.njk', {
			pageTitle: req.session.caseReference,
			taskListItems,
			showManageUsersLink: whitelistUser.userRoleId === WHITELIST_USER_ROLE_ID.ADMIN_USER,
			submissionText,
			warningText,
			submissionInformation,
			enableSubmissionButton,
			hasCaseBeenSubmitted: caseData.submissionDate != null,
			...viewData
		});
	};
}

export function buildSubmitHomePageController(service: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { db } = service;
		const { caseReference } = req.session;
		if (!caseReference) {
			return notFoundHandler(req, res);
		}

		const caseData = await db.case.findUnique({
			where: { reference: caseReference }
		});

		const allSectionsCompleted = [...DOCUMENT_CATEGORY, ...APPLICATION_SECTION]
			.filter((section) => !optionalSections.includes(section.id))
			.map((section) => section.id)
			.every(
				(section) =>
					(caseData as any)[`${kebabCaseToCamelCase(section)}StatusId`] === DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
			);

		if (!allSectionsCompleted) {
			const message = 'You must complete all required sections before sending your application';
			req.body.errors = {
				submission: { msg: message }
			};
			req.body.errorSummary = [
				{
					text: message,
					href: '#'
				}
			];

			const homePageController = buildHomePage(service, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return homePageController(req, res);
		}

		res.redirect('/position-in-organisation');
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
	return taskList.map((subtask) => {
		const subtaskDisplayName = optionalSections.includes(subtask.id)
			? `${subtask.displayName} (optional)`
			: subtask.displayName;
		return {
			title: {
				text: subtaskDisplayName,
				classes: 'govuk-link--no-visited-state'
			},
			href: `/${subtask.id}`,
			status: {
				tag: getCategoryStatus((caseData as any)[`${kebabCaseToCamelCase(subtask.id)}StatusId`])
			}
		};
	});
}

function getSubmissionDateContent(anticipatedDateOfSubmission: Date | null): {
	submissionText: string;
	warningText: string;
	submissionInformation: string;
	enableSubmissionButton: boolean;
} {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	if (!anticipatedDateOfSubmission) {
		return {
			submissionText: `<h2 class="govuk-heading-m">Confirm your submission date</h2>`,
			warningText: 'You cannot submit your application yet.',
			submissionInformation: `<p class="govuk-body">To submit, you must <a class="govuk-link govuk-link--no-visited-state" href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/contact" target="_blank" rel="noreferrer">contact the Planning Inspectorate (opens in new tab)</a> to confirm you submission date.</p>`,
			enableSubmissionButton: false
		};
	}

	const normalisedAnticipatedDateOfSubmission = new Date(anticipatedDateOfSubmission);
	normalisedAnticipatedDateOfSubmission.setHours(0, 0, 0, 0);

	if (
		normalisedAnticipatedDateOfSubmission.getTime() === today.getTime() ||
		normalisedAnticipatedDateOfSubmission.getTime() === tomorrow.getTime()
	) {
		return {
			submissionText: `<h2 class="govuk-heading-m">Now submit your application</h2><p class="govuk-body">You can now submit your application. Once the application is submitted, it will be locked and you can make no further changes.</p>`,
			warningText: `If you do not submit your application today, you'll need to agree a new submission date with the Planning Inspectorate`,
			submissionInformation: '',
			enableSubmissionButton: true
		};
	} else if (today < normalisedAnticipatedDateOfSubmission) {
		return {
			submissionText: `<h2 class="govuk-heading-m">You will be able to submit you application on ${formatDateForDisplay(anticipatedDateOfSubmission)}</h2><p class="govuk-body">Once the applications is submitted, it will be locked and you can make no further changes.</p>`,
			warningText: `If you miss this date, you'll need to agree a new submission date with the Planning Inspectorate`,
			submissionInformation: '',
			enableSubmissionButton: false
		};
	} else {
		return {
			submissionText: `<h2 class="govuk-heading-m">Your submission date has passed</h2>`,
			warningText: 'You cannot submit your application at this time.',
			submissionInformation: `<p class="govuk-body">You can continue working on your application, but you must <a class="govuk-link govuk-link--no-visited-state" href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/contact" target="_blank" rel="noreferrer">contact the Planning Inspectorate (opens in new tab)</a> to agree a new submission date.</p>`,
			enableSubmissionButton: false
		};
	}
}
