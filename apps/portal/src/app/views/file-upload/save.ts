import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { DocumentRecord } from './types.d.ts';
// @ts-expect-error - due to not having @types
import { yesNoToBoolean } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import type { UploadedFile } from '@pins/dco-portal-lib/forms/custom-components/file-upload/types.js';
import { clearSessionData } from '@pins/dco-portal-lib/util/session.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

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

				for (const file of answers.fileUpload) {
					const input: DocumentRecord = mapAnswersToInput(caseData?.id as string, file, answers);
					await $tx.document.create({ data: input });
				}

				if (
					(caseData as any)[`${kebabCaseToCamelCase(documentTypeId)}StatusId`] !==
					DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS
				) {
					await db.case.update({
						where: { reference: req.session.caseReference },
						data: { [`${kebabCaseToCamelCase(documentTypeId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS }
					});
				}
			});
		} catch (error) {
			logger.error({ error }, 'error saving document data to database');
			throw new Error('error saving upload document journey');
		}

		clearSessionData(req, documentTypeId, ['uploadedFiles'], 'files');
		clearDataFromSession({ req, journeyId: documentTypeId });

		res.redirect(req.baseUrl);
	};
}

function mapAnswersToInput(caseId: string, file: UploadedFile, answers: Record<string, any>): DocumentRecord {
	return {
		fileName: file.fileName,
		size: file.size,
		blobName: file.blobName,
		isCertified: yesNoToBoolean(answers.isCertified),
		SubCategory: {
			connect: {
				id: answers.documentType
			}
		},
		ApfpRegulation: {
			connect: {
				id: answers.apfpRegulation
			}
		},
		Case: {
			connect: {
				id: caseId
			}
		}
	};
}
