import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { ContactDetailsRecord } from './types.js';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
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

				const caseId = caseData?.id as string;
				const input: ContactDetailsRecord = mapAnswersToInput(answers);
				await $tx.contactDetails.upsert({
					where: { caseId },
					update: input,
					create: {
						...input,
						Case: {
							connect: {
								id: caseId
							}
						}
					}
				});

				if (
					(caseData as any)[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`] !==
					DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS
				) {
					await $tx.case.update({
						where: { reference: req.session.caseReference },
						data: { [`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS }
					});
				}
			});
		} catch (error) {
			logger.error({ error }, 'error saving applicant agent details data to database');
			throw new Error('error saving applicant agent details journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });

		res.redirect('/');
	};
}

function mapAnswersToInput(answers: Record<string, any>): ContactDetailsRecord {
	return {
		organisation: answers.organisation,
		paymentReference: answers.paymentReference,
		PaymentMethod: {
			connect: {
				id: answers.paymentMethod
			}
		}
	};
}
