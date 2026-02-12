import type { PortalService } from '#service';
import type { GeneratePdfInput } from './types.d.ts';
import { generatePdf } from './pdf.ts';
import { DEFAULT_PROJECT_EMAIL_ADDRESS } from '@pins/dco-portal-lib/govnotify/constants.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function bindPdfEvents(service: PortalService) {
	const { db, eventEmitter, pdfServiceClient, blobStore, notifyClient, logger } = service;
	console.log('binding pdf events');
	eventEmitter.on('generatePdf', async (data: GeneratePdfInput) => {
		console.log('received pdf event!');
		console.log(data);
		let pdfBuffer: Buffer<ArrayBuffer> | undefined;
		try {
			//skip pdf generation if required services not configured
			if (!pdfServiceClient || !blobStore) {
				logger.info('Skipping PDF generation - blob store and pdf client not configured');
				console.error('pdf client or blobstore not configured');
				return;
			}

			logger.info('Starting PDF generation for: ' + data.caseReference);
			console.log('beginning pdf generation for: ' + data.caseReference);
			pdfBuffer = await generatePdf(service, data);
			logger.info('PDF generated successfully for: ' + data.caseReference);
			console.log('PDF generated successfully for: ' + data.caseReference);
		} catch (err) {
			console.error('PDF generation failed: ' + err);
			logger.error('PDF generation failed: ' + err);
		}

		try {
			if (!db || !notifyClient) {
				console.log('skipping email dispatch - db and gov notiufy not configured');
				logger.info('Skipping email dispatch - db and gov notify client not configured');
				return;
			}

			const caseReference = data.caseReference;
			const caseData = await db.case.findUnique({
				where: { reference: caseReference }
			});

			if (!caseData || !pdfBuffer) {
				console.error('caseData or pdf file buffer undefined - skipping email dispatch');
				logger.error('caseData or pdf file buffer undefined - skipping email dispatch');
				return;
			}

			const adminUsers = await db.whitelistUser.findMany({
				where: {
					caseId: caseData.id,
					userRoleId: WHITELIST_USER_ROLE_ID.ADMIN_USER
				}
			});

			await Promise.all([
				...adminUsers.map((adminUser) =>
					notifyClient?.sendApplicantSubmissionNotification(adminUser.email, caseReference, pdfBuffer)
				),
				notifyClient?.sendPinsStaffSubmissionNotification(
					caseData.projectEmailAddress || DEFAULT_PROJECT_EMAIL_ADDRESS,
					caseReference,
					pdfBuffer
				)
			]);
		} catch (err) {
			console.error('error dispatching sub emails: ' + err);
			logger.error('Error dispatching submission emails: ' + err);
		}
	});
}
