import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { PortalService } from '#service';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import type { Request, Response } from 'express';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getSupportingEvidenceIds } from '../supporting-evidence/util.ts';

export function buildHabitatRegulationsAssessmentInformationHomePage(
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

		res.redirect(`${req.baseUrl}/details/european-and-ramsar-sites`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const habitatRegulationsAssessmentInformationDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT,
		DOCUMENT_SUB_CATEGORY_ID.REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: habitatRegulationsAssessmentInformationDocumentIds }
					}
				}
			}
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const reportToInformAppropriateAssessmentCount = await db.supportingEvidence.count({
		where: {
			caseId: caseData.id,
			subCategoryId: DOCUMENT_SUB_CATEGORY_ID.REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT
		}
	});

	const forms = req.session.forms || (req.session.forms = {});
	const hasEvidence = (caseData?.SupportingEvidence?.length ?? 0) > 0;

	forms[applicationSectionId] = hasEvidence
		? {
				europeanAndRamsarSites: 'yes',
				habitatRegulationsAssessmentScreeningReport: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
				),
				hasReportToInformAppropriateAssessment: reportToInformAppropriateAssessmentCount > 0 ? 'yes' : 'no',
				reportToInformAppropriateAssessment: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.REPORT_TO_INFORM_APPROPRIATE_ASSESSMENT
				)
			}
		: {
				europeanAndRamsarSites: 'no'
			};
}
