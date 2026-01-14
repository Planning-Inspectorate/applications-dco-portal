import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { mapAnswersToFullAddressInput, mapAnswersToContact } from './mappers.ts';
import type { ContactDetailsRecord } from './types.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		try {
			await db.$transaction(async ($tx) => {
				const caseData = await $tx.case.findUnique({
					where: { reference: req.session?.caseReference },
					include: {
						ApplicantDetails: {
							include: {
								Address: true
							}
						},
						AgentDetails: {
							include: {
								Address: true
							}
						},
						CasePaymentMethod: true
					}
				});

				const [applicantDetails, applicantAddress] = [
					mapAnswersToContact(answers, 'applicant'),
					mapAnswersToFullAddressInput(answers.applicantAddress)
				];
				const agentDetails = answers.isAgent === BOOLEAN_OPTIONS.YES ? mapAnswersToContact(answers, 'agent') : null;

				if (answers.isAgent === BOOLEAN_OPTIONS.NO && caseData?.AgentDetails) {
					await $tx.contactDetails.delete({
						where: { id: caseData?.AgentDetails?.id }
					});
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						paymentReference: answers.paymentReference,
						ApplicantDetails: {
							upsert: {
								update: {
									...applicantDetails,
									Address: {
										upsert: {
											update: applicantAddress,
											create: applicantAddress
										}
									}
								},
								create: {
									...applicantDetails,
									Address: {
										create: applicantAddress
									}
								}
							}
						},
						CasePaymentMethod: {
							connect: {
								id: answers.paymentMethod
							}
						},
						...(agentDetails !== null
							? buildAgentQuery(agentDetails, answers.agentAddress)
							: { AgentDetails: { disconnect: true } }),
						[`${kebabCaseToCamelCase(applicationSectionId)}Status`]: {
							connect: { id: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED }
						}
					}
				});
			});
		} catch (error) {
			logger.error({ error }, 'error saving applicant agent details data to database');
			throw new Error('error saving applicant agent details journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });

		res.redirect('/');
	};
}

function buildAgentQuery(agentDetails: ContactDetailsRecord, agentAddressAnswers: Record<string, any>) {
	const agentAddress = mapAnswersToFullAddressInput(agentAddressAnswers);
	return {
		AgentDetails: {
			upsert: {
				update: {
					...agentDetails,
					Address: {
						upsert: {
							update: agentAddress,
							create: agentAddress
						}
					}
				},
				create: {
					...agentDetails,
					Address: {
						create: agentAddress
					}
				}
			}
		}
	};
}
