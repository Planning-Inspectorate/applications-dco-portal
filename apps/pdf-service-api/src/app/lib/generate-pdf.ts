import type { Browser } from 'puppeteer-core';

export const generatePdf = async (browser: Browser, html: string): Promise<Uint8Array> => {
	try {
		const page = await browser.newPage();

		await page.setContent(html, {
			waitUntil: 'domcontentloaded'
		});

		await page.emulateMediaType('print');

		const pdfBuffer = await page.pdf({
			format: 'A4',
			scale: 0.9,
			printBackground: true
		});

		await browser.close();

		return Buffer.from(pdfBuffer);
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : '';
		throw new Error(errorMessage);
	}
};
