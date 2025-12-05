import { PortalService } from '#service';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getSupportingEvidenceIds } from '../supporting-evidence/util.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';

export function buildDraftOrderAndExplanatoryMemorandumHomePage(
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

		res.redirect(`${req.baseUrl}/details/draft-development-consent-order`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const draftOrderExplanatoryMemorandumDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER,
		DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL,
		DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: draftOrderExplanatoryMemorandumDocumentIds }
					}
				}
			}
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});

	forms[applicationSectionId] = {
		draftDevelopmentConsentOrder: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
		),
		siValidationReportSuccessEmail: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
		),
		explanatoryMemorandum: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM
		)
	};
}
