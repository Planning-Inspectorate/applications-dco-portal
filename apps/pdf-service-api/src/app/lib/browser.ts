import type { PdfService } from '#service';
import puppeteer from 'puppeteer-core';

export async function launchBrowser(service: PdfService) {
	switch (service.nodeEnv) {
		case 'development':
			return puppeteer.launch({
				channel: 'chrome',
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
			});
		default:
			return puppeteer.launch({
				executablePath: '/usr/bin/chromium-browser',
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
			});
	}
}
