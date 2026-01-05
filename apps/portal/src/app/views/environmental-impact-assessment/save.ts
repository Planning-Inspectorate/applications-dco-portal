import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { getAnswersFromRes } from '@pins/dco-portal-lib/util/answers.ts';
// @ts-expect-error - due to not having @types
import { clearDataFromSession } from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { CategoryInformation } from '../supporting-evidence/types.d.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { deleteSubCategorySupportingEvidence, saveSupportingEvidence } from '../supporting-evidence/db-operations.ts';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';

export function buildSaveController({ db, logger }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		const answers = getAnswersFromRes(res);
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		try {
			await db.$transaction(async ($tx) => {
				const caseId = caseData.id;
				const otherEnvironmentalDocuments = answers.otherEnvironmentalDocuments || [];
				const categories: CategoryInformation[] = [
					{
						key: 'nonTechnicalSummary',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
						applied: answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'screeningDirectionDocuments',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
						applied: answers.hasScreeningDirection === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'scopingOpinionDocuments',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION,
						applied: answers.hasScopingOpinion === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'introductoryChapters',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'aspectChapters',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'environmentStatementAppendices',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'environmentStatementFigures',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'modelInformation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'anyOtherMediaInformation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'confidentialDocuments',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					},
					{
						key: 'sensitiveInformation',
						subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION,
						applied:
							otherEnvironmentalDocuments.includes(DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION) &&
							answers.hasEnvironmentalStatement === BOOLEAN_OPTIONS.YES
					}
				];

				await deleteSubCategorySupportingEvidence($tx, caseId, categories);

				for (const { key, subCategoryId, applied } of categories) {
					if (!applied) continue;
					const ids = answers[key]?.split(',') ?? [];
					for (const documentId of ids) {
						await saveSupportingEvidence($tx, caseId, documentId, subCategoryId);
					}
				}

				await $tx.case.update({
					where: { reference: req.session.caseReference },
					data: {
						notifiedOtherPeople: answers.notifyingOtherPeople === BOOLEAN_OPTIONS.YES ? true : false,
						[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
					}
				});
			});
		} catch (error) {
			console.log(error);
			logger.error({ error }, 'error saving environmental impact assessment data to database');
			throw new Error('error saving environmental impact assessment journey');
		}

		clearDataFromSession({ req, journeyId: applicationSectionId });
		res.redirect('/');
	};
}
