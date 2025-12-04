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

export function buildLandRightsInformationHomePage(
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

		res.redirect(`${req.baseUrl}/details/compulsory-acquisition`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const landRightsInformationDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS,
		DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT,
		DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5,
		DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: landRightsInformationDocumentIds }
					}
				}
			}
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});
	const hasEvidence = (caseData?.SupportingEvidence?.length ?? 0) > 0;

	forms[applicationSectionId] = hasEvidence
		? {
				compulsoryAcquisition: 'yes',
				statementOfReasons: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS
				),
				fundingStatement: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT
				),
				bookOfReference: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5
				),
				landAndRightsNegotiationsTracker: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER
				)
			}
		: {
				compulsoryAcquisition: 'no'
			};
}
