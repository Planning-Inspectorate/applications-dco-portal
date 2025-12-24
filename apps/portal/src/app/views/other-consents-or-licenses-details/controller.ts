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

export function buildOtherConsentsOrLicencesDetailsHomePage(
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

		res.redirect(`${req.baseUrl}/details/has-other-consents`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const otherConsentsOrLicencesDocumentIds = [
		DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
	];

	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			SupportingEvidence: {
				where: {
					SubCategory: {
						id: { in: otherConsentsOrLicencesDocumentIds }
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
				hasOtherConsents: 'yes',
				otherConsentsDescription: caseData.otherConsentsDescription || '',
				otherConsentsDocuments: getSupportingEvidenceIds(
					caseData.SupportingEvidence,
					DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
				)
			}
		: {
				hasOtherConsents: 'no'
			};
}
