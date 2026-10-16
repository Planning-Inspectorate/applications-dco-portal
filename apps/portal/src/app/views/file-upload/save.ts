import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { DocumentRecord } from './types.d.ts';
import { clearDataFromSession, yesNoToBoolean } from '@planning-inspectorate/dynamic-forms';
import type { UploadedFile } from '@pins/dco-portal-lib/forms/custom-components/file-upload/types.js';
import { clearSessionData } from '@pins/dco-portal-lib/util/session.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID, SCAN_RESULT_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';

export function buildSaveController({ db, logger }: PortalService, documentTypeId: string): AsyncRequestHandler {
	return async (req, res) => {
		const { caseReference, emailAddress } = req.session;
		if (!caseReference || !emailAddress) {
			return notFoundHandler(req, res);
		}

		const answers = getAnswersFromRes(res);
		try {
			await db.$transaction(async ($tx) => {
				const caseData = await $tx.case.findUnique({
					where: { reference: req.session?.caseReference }
				});

				for (const file of answers.fileUpload) {
					const input: DocumentRecord = mapAnswersToInput(
						caseData?.id as string,
						req.session.emailAddress as string,
						file,
						answers
					);
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
			throw new Error('error saving upload document journey', { cause: error });
		}

		clearSessionData(req, documentTypeId, ['uploadedFiles'], 'files');
		clearDataFromSession({ req, journeyId: documentTypeId });

		res.redirect(req.baseUrl);
	};
}

function mapAnswersToInput(
	caseId: string,
	uploaderEmailAddress: string,
	file: UploadedFile,
	answers: Record<string, any>
): DocumentRecord {
	return {
		fileName: file.fileName,
		size: file.size,
		blobName: file.blobName,
		mimeType: file.mimeType,
		isCertified: yesNoToBoolean(answers.isCertified),
		uploaderEmail: uploaderEmailAddress,
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
		ScanResult: {
			connect: {
				id: SCAN_RESULT_ID.PENDING
			}
		},
		Case: {
			connect: {
				id: caseId
			}
		}
	};
}
