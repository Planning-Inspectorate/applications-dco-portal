import { PortalService } from '#service';
import type { Logger } from 'pino';
import { mapCaseToDcoApplication } from '@pins/dco-portal-lib/pdf-service/mappers/dco-application-mapper.ts';
import { getNunjucksEnv } from '../../nunjucks.ts';
import fs from 'fs';
import type { GeneratePdfInput } from './types.d.ts';

export async function generatePdf(service: PortalService, data: GeneratePdfInput) {
	const { pdfServiceClient, blobStore, db, logger } = service;

	const caseData = await db.case.findUnique({
		where: { reference: data.caseReference },
		include: {
			SupportingEvidence: {
				include: { Document: true }
			},
			ApplicantDetails: {
				include: { Address: true }
			},
			AgentDetails: {
				include: { Address: true }
			},
			CasePaymentMethod: true,
			ProjectSingleSite: true,
			ProjectLinearSite: true,
			NonOffshoreGeneratingStation: true,
			OffshoreGeneratingStation: true,
			HighwayRelatedDevelopment: true,
			RailwayDevelopment: true,
			HarbourFacilities: true,
			Pipelines: true,
			HazardousWasteFacility: true,
			DamOrReservoir: true
		}
	});
	if (!caseData?.anticipatedDateOfSubmission)
		throw new Error('anticipated date of submission is missing from case data');

	const dcoApplicationData = mapCaseToDcoApplication(caseData);
	const env = getNunjucksEnv();
	env.render(
		'views/layouts/application-pdf.njk',
		{
			dcoApplicationData
		},
		async (error, html) => {
			if (error) {
				throw error;
			}
			if (!html) {
				throw new Error('html markup generation failed');
			}
			const cssPath = `${service.staticDir}/${data.styleFile}`;
			const pdfHtml = await addCSStoHtml(html, cssPath, logger);
			const pdf = await pdfServiceClient?.generatePdf(pdfHtml);

			if (!Buffer.isBuffer(pdf) || pdf.length === 0) {
				throw new Error('PDF generation returned an invalid or empty buffer');
			}

			const blobName = getPdfBlobName(data.caseReference as string, caseData.anticipatedDateOfSubmission!);
			logger.info('Attempting to delete pdf at blob: ' + blobName);
			try {
				await blobStore?.deleteBlobIfExists(blobName);
			} catch {
				logger.info('no existing pdf to delete prior to upload');
			}

			logger.info('Uploading generated pdf to blob: ' + blobName);
			await blobStore?.upload(pdf, 'application/pdf', blobName);

			await db.case.update({
				where: { reference: data.caseReference },
				data: { pdfBlobName: blobName }
			});
		}
	);
}

/**
 * @returns html with added css if <head> valid, otherwise returns unedited html passed in
 */
export const addCSStoHtml = async (html: string, cssPath: string, logger: Logger): Promise<string> => {
	const htmlArray = html.split('<head>');
	if (htmlArray.length !== 2) return html;

	try {
		const css = await fs.promises.readFile(cssPath, 'utf8');
		return htmlArray[0] + `<head><style>${css}</style>` + htmlArray[1];
	} catch (err) {
		logger.error({ err }, 'could not resolve style file path:' + cssPath);
		return html;
	}
};

function getPdfBlobName(caseReference: string, anticipatedDateOfSubmission: Date): string {
	const normalisedAnticipatedDateOfSubmission = new Date(anticipatedDateOfSubmission as Date);
	normalisedAnticipatedDateOfSubmission.setHours(0, 0, 0, 0);
	return `${caseReference}/data-submissions/${normalisedAnticipatedDateOfSubmission.toISOString().slice(0, 10)}-submission.pdf`;
}
