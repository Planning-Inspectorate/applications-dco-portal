import { PdfService } from '#service';
import type { Request, Response } from 'express';
import { generatePdf } from '../lib/generate-pdf.ts';
import { launchBrowser } from '../lib/browser.ts';

export function postGeneratePdf(service: PdfService) {
	return async (req: Request, res: Response) => {
		const html = req.body?.html;
		const logger = service.logger;

		logger.info('POST request to generate pdf');
		logger.debug({ body: req.body }, 'html to convert to pdf:');

		if (!html || typeof html !== 'string') {
			logger.error('Error: Stringified html is required');
			return res.status(400).send({ message: 'Stringified html is required' });
		}

		try {
			const browser = await launchBrowser(service);
			const pdfBuffer = await generatePdf(browser, html);
			res.contentType('application/pdf').send(pdfBuffer);
			logger.info('Successfully generated pdf');
		} catch (err: any) {
			logger.error({ err }, 'Failed to download pdf');
			res.status(500).send({
				message: err?.message || 'An error occurred'
			});
		}
	};
}
