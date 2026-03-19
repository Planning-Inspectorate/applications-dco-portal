import { PdfService } from '#service';
import type { Request, Response } from 'express';
import { generatePdf } from '../lib/generate-pdf.ts';
import { PdfBrowser } from '../lib/browser.ts';

export function postGeneratePdf(service: PdfService) {
	return async (req: Request, res: Response) => {
		const html = req.body?.html;
		const logger = service.logger;

		logger.info('POST request to generate pdf');

		if (!html || typeof html !== 'string') {
			logger.error('Error: Stringified html is required');
			return res.status(400).send({ message: 'Stringified html is required' });
		}

		const browser = PdfBrowser.getInstance();
		let page;
		try {
			//ensure browser launched if not already
			await browser.launch(service.nodeEnv);
			page = await browser.newPage();
		} catch (err: any) {
			logger.error({ err }, 'Failed to create page in headless browser');
			return res.status(500).send({ message: err?.message || 'An error occurred' });
		}

		try {
			const pdfBuffer = await generatePdf(html, page);
			res.contentType('application/pdf').send(pdfBuffer);
			logger.info('Successfully generated pdf');
		} catch (err: any) {
			logger.error({ err }, 'Failed to download pdf');
			res.status(500).send({
				message: err?.message || 'An error occurred'
			});
		} finally {
			if (page) {
				await browser.closePage(page);
			}
		}
	};
}
