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

export function buildCrownLandAccessAndRightsOfWayPlansHomePage(
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

		res.redirect(`${req.baseUrl}/details/has-crown-land`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const crownLandDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN,
		DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: crownLandDocumentIds }
					}
				}
			}
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const [crownLandCount, meansOfAccessCount] = await Promise.all([
		db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN
			}
		}),
		db.supportingEvidence.count({
			where: {
				caseId: caseData.id,
				subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
			}
		})
	]);

	const forms = req.session.forms || (req.session.forms = {});

	forms[applicationSectionId] = {
		hasCrownLand: crownLandCount > 0 ? 'yes' : 'no',
		crownLand: getSupportingEvidenceIds(caseData.SupportingEvidence, DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN),
		hasMeansOfAccess: meansOfAccessCount > 0 ? 'yes' : 'no',
		meansOfAccess: getSupportingEvidenceIds(
			caseData.SupportingEvidence,
			DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
		)
	};
}
