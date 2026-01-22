import puppeteer from 'puppeteer-core';

export async function launchBrowser() {
	switch (process.platform) {
		case 'linux':
			return puppeteer.launch({
				executablePath: '/usr/bin/chromium-browser',
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
			});
		case 'darwin':
			return puppeteer.launch({
				channel: 'chrome',
				headless: true,
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
			});
		default:
			throw new Error(`Unsupported platform: ${process.platform}`);
	}
}
