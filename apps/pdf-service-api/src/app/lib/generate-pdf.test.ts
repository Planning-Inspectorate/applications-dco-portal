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

			const mockPage = {
				setContent: mock.fn(),
				emulateMediaType: mock.fn(),
				pdf: mock.fn(() => 'input-html-as-a-pdf')
			};

			const pdfBuffer = await generatePdf(html, mockPage);

			assert.strictEqual(mockPage.setContent.mock.callCount(), 1);
			assert.strictEqual(mockPage.emulateMediaType.mock.callCount(), 1);
			assert.strictEqual(mockPage.pdf.mock.callCount(), 1);

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

			const mockPage = {
				setContent: mock.fn(),
				emulateMediaType: mock.fn(() => {
					throw new Error('test-error');
				}),
				pdf: mock.fn(() => 'input-html-as-a-pdf')
			};

			await assert.rejects(
				async () => {
					const pdfBuffer = await generatePdf(html, mockPage);
				},
				{
					message: 'test-error'
				}
			);

			assert.strictEqual(mockPage.setContent.mock.callCount(), 1);
			assert.strictEqual(mockPage.emulateMediaType.mock.callCount(), 1);
			assert.strictEqual(mockPage.pdf.mock.callCount(), 0);
		});
	});
});
