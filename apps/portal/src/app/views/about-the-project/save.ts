import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { mapAnswersToCase, mapAnswersToLinearSite, mapAnswersToSingleSite } from './mappers.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { ProjectSingleSiteInput, ProjectLinearSiteInput } from './types.d.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		try {
			await db.$transaction(async ($tx) => {
				const caseData = await $tx.case.findUnique({
					where: { reference: req.session?.caseReference },
					include: {
						ProjectSingleSite: true,
						ProjectLinearSite: true
					}
				});

				const caseInput = mapAnswersToCase(answers);
				const singleSiteInput = answers.singleOrLinear === 'single' ? mapAnswersToSingleSite(answers) : null;
				const linearSiteInput = answers.singleOrLinear === 'linear' ? mapAnswersToLinearSite(answers) : null;

				if (answers.singleOrLinear === 'single') {
					if (caseData?.ProjectLinearSite) {
						await $tx.linearSite.delete({
							where: { id: caseData?.ProjectLinearSite?.id }
						});
					}
				} else {
					if (caseData?.ProjectSingleSite) {
						await $tx.singleSite.delete({
							where: { id: caseData?.ProjectSingleSite?.id }
						});
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						...caseInput,
						...(singleSiteInput !== null
							? buildSingleSiteQuery(singleSiteInput)
							: { ProjectSingleSite: { disconnect: true } }),
						...(linearSiteInput !== null
							? buildLinearSiteQuery(linearSiteInput)
							: { ProjectLinearSite: { disconnect: true } }),
						[`${kebabCaseToCamelCase(applicationSectionId)}Status`]: {
							connect: { id: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
						}
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

function buildSingleSiteQuery(singleSiteInput: ProjectSingleSiteInput) {
	return {
		ProjectSingleSite: {
			upsert: {
				update: {
					...singleSiteInput
				},
				create: {
					...singleSiteInput
				}
			}
		}
	};
}

function buildLinearSiteQuery(linearSiteInput: ProjectLinearSiteInput) {
	return {
		ProjectLinearSite: {
			upsert: {
				update: {
					...linearSiteInput
				},
				create: {
					...linearSiteInput
				}
			}
		}
	};
}
