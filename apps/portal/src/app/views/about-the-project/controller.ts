import { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import { getSupportingEvidenceIds } from '../supporting-evidence/util.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import { PROJECT_SITE_TYPE_IDS } from './constants.ts';

export function buildAboutTheProjectHomePage({ db }: PortalService, applicationSectionId: string): AsyncRequestHandler {
	return async (req, res) => {
		await populateForm(req, res, db, applicationSectionId);
		res.redirect(`${req.baseUrl}/about/description`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const associatedDevelopmentDocumentIds = [DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: associatedDevelopmentDocumentIds }
					}
				}
			},
			ProjectLinearSite: true,
			ProjectSingleSite: true
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});
	const hasEvidence = (caseData?.SupportingEvidence?.length ?? 0) > 0;
	const standardFields = {
		consentReason: caseData.projectConsentReason || '',
		description: caseData.projectDescription || '',
		locationDescription: caseData.locationDescription || '',
		singleOrLinear: caseData.ProjectSingleSite ? PROJECT_SITE_TYPE_IDS.SINGLE : PROJECT_SITE_TYPE_IDS.LINEAR,
		easting: String(caseData.ProjectSingleSite?.easting || ''),
		northing: String(caseData.ProjectSingleSite?.northing || ''),
		startEasting: String(caseData.ProjectLinearSite?.startEasting || ''),
		startNorthing: String(caseData.ProjectLinearSite?.startNorthing || ''),
		middleEasting: String(caseData.ProjectLinearSite?.middleEasting || ''),
		middleNorthing: String(caseData.ProjectLinearSite?.middleNorthing || ''),
		endEasting: String(caseData.ProjectLinearSite?.endEasting || ''),
		endNorthing: String(caseData.ProjectLinearSite?.endNorthing || '')
	};

	forms[applicationSectionId] = hasEvidence
		? {
				hasAssociatedDevelopments: 'yes',
				associatedDevelopments: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT
				),
				...standardFields
			}
		: {
				hasAssociatedDevelopments: 'no',
				...standardFields
			};
}
