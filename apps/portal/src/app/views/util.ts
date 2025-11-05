import { DOCUMENT_CATEGORY, DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION } from './constants.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

// @ts-expect-error - due to not having @types
import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';

export function getDocumentCategoryDisplayName(documentCategoryId: string): string {
	return DOCUMENT_CATEGORY.find(({ id }) => id === documentCategoryId)?.displayName ?? '';
}

export function getApplicationSectionDisplayName(applicationSectionId: string): string {
	return APPLICATION_SECTION.find(({ id }) => id === applicationSectionId)?.displayName ?? '';
}

export function statusIdRadioButtonValue(statusId: string): string {
	const STATUS_ID_TO_RADIO_VALUE: Record<string, string> = {
		[DOCUMENT_CATEGORY_STATUS_ID.COMPLETED]: 'yes',
		[DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS]: 'no'
	};
	return STATUS_ID_TO_RADIO_VALUE[statusId] ?? '';
}

export function buildIsTaskCompleted(
	service: PortalService,
	journeyId: string,
	buildHomepageFunc: ({ db }: PortalService, applicationSectionId: string, viewData?: object) => AsyncRequestHandler
): AsyncRequestHandler {
	return async (req, res) => {
		const { db } = service;

		const sectionCompletedFieldName = `${kebabCaseToCamelCase(journeyId)}IsCompleted`;
		const isSectionCompleted = req.body[sectionCompletedFieldName];

		if (!isSectionCompleted) {
			req.body.errors = {
				[sectionCompletedFieldName]: { msg: 'You must select an answer' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const taskHomepage = buildHomepageFunc(service, journeyId, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return taskHomepage(req, res);
		}

		const statusId: string =
			isSectionCompleted === BOOLEAN_OPTIONS.YES
				? DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
				: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS;

		await db.case.update({
			where: { reference: req.session.caseReference },
			data: { [`${kebabCaseToCamelCase(journeyId)}StatusId`]: statusId }
		});

		res.redirect('/');
	};
}
