// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { generatePdf } from './generate-pdf.ts';
import puppeteer from 'puppeteer-core';
import { PdfBrowser } from './browser.ts';

describe('PdfBrowser', () => {
	describe('getInstance', () => {
		it('getInstance should return the same instance of singleton class', () => {
			const instance1 = PdfBrowser.getInstance();
			const instance2 = PdfBrowser.getInstance();
			assert.strictEqual(instance1, instance2);
		});
	});
	describe('getBrowser', () => {
		it('should throw if browser not launched', () => {
			const pdfBrowser = PdfBrowser.getInstance();
			(pdfBrowser as any).browser = null;

			assert.throws(() => pdfBrowser.getBrowser(), {
				message: 'Browser not initialized. Remember to launch the browser before use'
			});
		});
	});
	describe('newPage', () => {
		it('should throw if browser not launched', async () => {
			const pdfBrowser = PdfBrowser.getInstance();
			(pdfBrowser as any).browser = null;

			await assert.rejects(() => pdfBrowser.newPage(), {
				message: 'Browser not initialized. Remember to launch the browser before use'
			});
		});
	});
});
