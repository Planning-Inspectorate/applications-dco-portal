import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { DocumentRecord } from './types.d.ts';
// @ts-expect-error - due to not having @types
import { yesNoToBoolean } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';

export function buildSaveController({ db, logger }: PortalService, documentTypeId: string): AsyncRequestHandler {
	return async (req, res) => {
		if (!res.locals || !res.locals.journeyResponse) {
			throw new Error('journey response required');
		}
		const journeyResponse = res.locals.journeyResponse;
		const answers = journeyResponse.answers;
		if (typeof answers !== 'object') {
			throw new Error('answers should be an object');
		}

		try {
			await db.$transaction(async ($tx) => {
				const caseData = await $tx.case.findUnique({
					where: { reference: req.session?.caseReference }
				});

				const input: DocumentRecord = {
					fileName: 'test.pdf',
					isCertified: yesNoToBoolean(answers.isCertified),
					subCategoryId: answers.documentType,
					apfpRegulationId: answers.apfpRegulation,
					caseId: caseData?.id as string
				};

				await $tx.document.create({ data: input });
			});
		} catch (error) {
			logger.error({ error }, 'error saving document data to database');
			throw new Error('error saving upload document journey');
		}

		//TODO: clearSessionData -> remove documents
		clearDataFromSession({ req, journeyId: documentTypeId });

		res.redirect(req.baseUrl);
	};
}
