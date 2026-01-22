import { launchBrowser } from './browser.ts';

export const generatePdf = async (html: string): Promise<Uint8Array> => {
	try {
		const browser = await launchBrowser();

		const page = await browser.newPage();

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
	} catch (err: any) {
		throw new Error(err);
	}
};
