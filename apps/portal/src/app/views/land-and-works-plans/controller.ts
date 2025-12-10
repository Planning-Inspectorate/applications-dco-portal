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

export function buildLandAndWorksPlansHomePage(
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

		res.redirect(`${req.baseUrl}/details/land-plans`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const landAndWorksPlansDocumentIds = [DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS, DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: landAndWorksPlansDocumentIds }
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
		landPlans: getSupportingEvidenceIds(caseData.SupportingEvidence, DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS),
		worksPlans: getSupportingEvidenceIds(caseData.SupportingEvidence, DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN)
	};
}
