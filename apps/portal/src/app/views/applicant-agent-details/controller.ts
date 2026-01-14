import { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { kebabCaseToCamelCase } from '@pins/dco-portal-lib/util/questions.ts';
import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import type { Request, Response } from 'express';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';

export function buildApplicantAgentDetailsHomePage(
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
		res.redirect(`${req.baseUrl}/applicant/organisation`);
	};
}

async function populateForm(req: Request, res: Response, db: PrismaClient, applicationSectionId: string) {
	const caseData = await db.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			ApplicantDetails: {
				include: {
					Address: true
				}
			},
			AgentDetails: {
				include: {
					Address: true
				}
			},
			CasePaymentMethod: true
		}
	});

	if (!caseData) {
		return notFoundHandler(req, res);
	}

	const forms = req.session.forms || (req.session.forms = {});

	//TODO: Test save.ts to ensure saving all looks as expected e.g. toggle yes or no agent and see if deletese properly
	forms[applicationSectionId] = {
		applicantOrganisation: caseData.ApplicantDetails?.organisation || '',
		applicantFirstName: caseData.ApplicantDetails?.firstName || '',
		applicantLastName: caseData.ApplicantDetails?.lastName || '',
		applicantEmailAddress: caseData.ApplicantDetails?.emailAddress || '',
		applicantPhone: caseData.ApplicantDetails?.phone || '',
		applicantAddress: {
			addressLine1: caseData.ApplicantDetails?.Address?.addressLine1 || '',
			addressLine2: caseData.ApplicantDetails?.Address?.addressLine2 || '',
			townCity: caseData.ApplicantDetails?.Address?.townCity || '',
			county: caseData.ApplicantDetails?.Address?.county || '',
			country: caseData.ApplicantDetails?.Address?.country || '',
			postcode: caseData.ApplicantDetails?.Address?.postcode || ''
		},
		isAgent: caseData.AgentDetails ? 'yes' : 'no',
		agentOrganisation: caseData.AgentDetails?.organisation || '',
		agentFirstName: caseData.AgentDetails?.firstName || '',
		agentLastName: caseData.AgentDetails?.lastName || '',
		agentEmailAddress: caseData.AgentDetails?.emailAddress || '',
		agentPhone: caseData.AgentDetails?.phone || '',
		agentAddress: {
			addressLine1: caseData.AgentDetails?.Address?.addressLine1 || '',
			addressLine2: caseData.AgentDetails?.Address?.addressLine2 || '',
			townCity: caseData.AgentDetails?.Address?.townCity || '',
			county: caseData.AgentDetails?.Address?.county || '',
			country: caseData.AgentDetails?.Address?.country || '',
			postcode: caseData.AgentDetails?.Address?.postcode || ''
		},
		paymentMethod: caseData?.CasePaymentMethod?.id || '',
		paymentReference: caseData?.paymentReference || ''
	};
}
