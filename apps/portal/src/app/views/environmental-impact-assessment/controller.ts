import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getSupportingEvidenceIds } from '../supporting-evidence/util.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';

export function buildEnvironmentalImpactAssessmentHomePage(
	{ db }: PortalService,
	applicationSectionId: string
): AsyncRequestHandler {
	return async (req, res) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session?.caseReference }
		});

		if (
			(caseData as any)[`${kebabCaseToCamelCase(applicationSectionId)}StatusId`] !==
			DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
		) {
			await populateForm(req, res, db, applicationSectionId);
		}

		res.redirect(`${req.baseUrl}/details/has-environmental-statement`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const environmentalImpactDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY,
		DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION,
		DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: environmentalImpactDocumentIds }
					}
				}
			}
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});

	const [nonTechnicalSummaryCount, screeningDirectionCount, scopingOpinionCount] = await Promise.all([
		db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY
			}
		}),
		db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION
			}
		}),
		db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION
			}
		})
	]);

	forms[applicationSectionId] = {
		hasEnvironmentalStatement: nonTechnicalSummaryCount > 0 ? 'yes' : 'no',
		nonTechnicalSummary: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY
		),
		hasScreeningDirection: screeningDirectionCount > 0 ? 'yes' : 'no',
		screeningDirectionDocuments: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION
		),
		hasScopingOpinion: scopingOpinionCount > 0 ? 'yes' : 'no',
		scopingOpinionDocuments: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION
		)
	};
}
