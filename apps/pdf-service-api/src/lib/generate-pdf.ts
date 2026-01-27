import type { Browser } from 'puppeteer-core';

export const generatePdf = async (browser: Browser, html: string): Promise<Uint8Array> => {
	try {
		const page = await browser.newPage();

		page.on('console', (msg) => {
			console.log('[browser console]', msg.type(), msg.text());
		});

		page.on('pageerror', (err) => {
			console.error('[page error]', err);
		});

		page.on('requestfailed', (req) => {
			console.error('[request failed]', req.url(), req.failure()?.errorText);
		});

		await page.setContent(html, {
			waitUntil: 'domcontentloaded'
		});

		await page.emulateMediaType('print');

		const pdfBuffer = await page.pdf({
			format: 'A4',
			scale: 0.9
		});

		await browser.close();

		return Buffer.from(pdfBuffer);
	} catch (err) {
		let errorMessage = err instanceof Error ? err.message : '';
		throw new Error(errorMessage);
	}
};
