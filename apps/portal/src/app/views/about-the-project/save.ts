import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { mapAnswersToCase } from './mappers.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		try {
			await db.$transaction(async ($tx) => {
				const input = mapAnswersToCase(answers);
				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						...input,
						[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
					}
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving about the project data to database');
			throw new Error('error saving about the project journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });

		res.redirect('/');
	};
}
