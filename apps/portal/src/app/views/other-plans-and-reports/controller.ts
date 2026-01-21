import { PortalService } from '#service';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getMultiSubcategorySupportingEvidenceIds } from '../supporting-evidence/util.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import {
	OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS,
	OTHER_INFORMATION_SUBCATEGORY_IDS
} from '@pins/dco-portal-database/src/seed/data-static.ts';

export function buildOtherPlansAndReportsHomePage(
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

		res.redirect(`${req.baseUrl}/details/plans-drawings-sections`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: [...OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS, ...OTHER_INFORMATION_SUBCATEGORY_IDS] }
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
		otherPlansDrawingsSections: getMultiSubcategorySupportingEvidenceIds(
			caseData.SupportingEvidence,
			OTHER_PLANS_DRAWINGS_SECTIONS_SUBCATEGORY_IDS
		),
		otherInformation: getMultiSubcategorySupportingEvidenceIds(
			caseData.SupportingEvidence,
			OTHER_INFORMATION_SUBCATEGORY_IDS
		)
	};
}
