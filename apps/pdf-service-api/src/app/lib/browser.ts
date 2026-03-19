import puppeteer, { Browser, Page } from 'puppeteer-core';

export class PdfBrowser {
	private static instance: PdfBrowser | null = null;
	private browser: Browser | null = null;
	private nodeEnv: string = 'local';

	private constructor() {}

	static getInstance(): PdfBrowser {
		if (!PdfBrowser.instance) {
			PdfBrowser.instance = new PdfBrowser();
		}
		return PdfBrowser.instance;
	}

	private getBrowser(): Browser {
		if (!this.browser) {
			throw new Error('Browser not initialized. Remember to launch the browser before use');
		}
		return this.browser;
	}

	async launch(nodeEnv: string): Promise<void> {
		if (this.browser) return;
		this.nodeEnv = nodeEnv;

		switch (this.nodeEnv) {
			case 'local':
				this.browser = await puppeteer.launch({
					channel: 'chrome',
					headless: true,
					args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
				});
				break;
			default:
				this.browser = await puppeteer.launch({
					executablePath: '/usr/bin/chromium-browser',
					headless: true,
					args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
				});
		}

		this.browser.on('disconnected', async () => {
			console.log('Browser disconnected, relaunching...');
			this.browser = null;
			await this.launch(this.nodeEnv);
		});
	}

	async newPage(): Promise<Page> {
		return this.getBrowser().newPage();
	}

	async closePage(page: Page): Promise<void> {
		await page.close();
	}
}
