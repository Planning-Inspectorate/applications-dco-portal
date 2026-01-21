import type { PortalService } from '#service';
import type { GeneratePdfInput } from './types.d.ts';
import { generatePdf } from './pdf.ts';

export function bindPdfEvents(service: PortalService) {
	const { eventEmitter, pdfServiceClient, blobStore, logger } = service;
	eventEmitter.on('generatePdf', async (data: GeneratePdfInput) => {
		try {
			//skip pdf generation if required services not configured
			if (!pdfServiceClient || !blobStore) {
				logger.info('Skipping PDF generation - blob store and pdf client not configured');
				return;
			}

			logger.info('Starting PDF generation for: ' + data.caseReference);
			await generatePdf(service, data);
			logger.info('PDF generated successfully for: ' + data.caseReference);
		} catch (err) {
			logger.error('PDF generation failed: ' + err);
		}
	});
}
