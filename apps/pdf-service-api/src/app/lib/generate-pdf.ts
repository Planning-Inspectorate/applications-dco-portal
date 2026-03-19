import type { Page } from 'puppeteer-core';

export const generatePdf = async (html: string, page: Page): Promise<Uint8Array> => {
	await page.setContent(html, {
		waitUntil: 'domcontentloaded'
	});

	await page.emulateMediaType('print');

	const pdfBuffer = await page.pdf({
		format: 'A4',
		scale: 0.9,
		printBackground: true
	});

	return Buffer.from(pdfBuffer);
};
