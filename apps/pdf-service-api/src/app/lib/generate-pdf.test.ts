// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { generatePdf } from './generate-pdf.ts';

describe('lib/generate-pdf.ts', () => {
	describe('generatePdf', () => {
		it('uses a given stringified html document in a puppeteer browser to successfully generate a pdf file', async () => {
			const html = `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <title>Hello</title>
                    </head>
                    <body>
                        <h1>Hello, world</h1>
                        <p>This is a tiny HTML example.</p>
                        <button>Click me</button>
                    </body>
                </html>`;

			const mockNewPage = {
				setContent: mock.fn(),
				emulateMediaType: mock.fn(),
				pdf: mock.fn(() => 'input-html-as-a-pdf')
			};
			const mockBrowser = {
				newPage: mock.fn(() => mockNewPage),
				close: mock.fn()
			};

			const pdfBuffer = await generatePdf(mockBrowser, html);

			assert.strictEqual(mockBrowser.newPage.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.setContent.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.emulateMediaType.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.pdf.mock.callCount(), 1);
			assert.strictEqual(mockBrowser.close.mock.callCount(), 1);

			const expected = Buffer.from('input-html-as-a-pdf');
			assert.deepStrictEqual(expected, pdfBuffer);
		});
		it('should propagate if any part throws an error', async () => {
			const html = `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <title>Hello</title>
                    </head>
                    <body>
                        <h1>Hello, world</h1>
                        <p>This is a tiny HTML example.</p>
                        <button>Click me</button>
                    </body>
                </html>`;

			const mockNewPage = {
				setContent: mock.fn(),
				emulateMediaType: mock.fn(() => {
					throw new Error('test-error');
				}),
				pdf: mock.fn(() => 'input-html-as-a-pdf')
			};
			const mockBrowser = {
				newPage: mock.fn(() => mockNewPage),
				close: mock.fn()
			};

			await assert.rejects(
				async () => {
					const pdfBuffer = await generatePdf(mockBrowser, html);
				},
				{
					message: 'test-error'
				}
			);

			assert.strictEqual(mockBrowser.newPage.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.setContent.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.emulateMediaType.mock.callCount(), 1);
			assert.strictEqual(mockNewPage.pdf.mock.callCount(), 0);
			assert.strictEqual(mockBrowser.close.mock.callCount(), 0);
		});
	});
});
