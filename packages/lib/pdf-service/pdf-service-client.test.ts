// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { PdfServiceClient } from './pdf-service-client.ts';
import { mockLogger } from '../testing/mock-logger.ts';

describe('lib/pdf-service-client', () => {
	describe('generatePdf', () => {
		it('queries the pdf-service-api to generate a pdf from a html document', async (ctx) => {
			ctx.mock.method(global, 'fetch', async () => {
				return { ok: true, status: 200, arrayBuffer: mock.fn(() => 'test result') };
			});
			const logger = mockLogger();
			const client = new PdfServiceClient(logger, 'http://localhost:3000');

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
			const pdfBuffer = await client.generatePdf(html);

			assert.strictEqual(logger.info.mock.callCount(), 2);
			assert.strictEqual(logger.error.mock.callCount(), 0);
			assert.strictEqual(global.fetch.mock.callCount(), 1);

			const expected = Buffer.from('test result');
			assert.deepStrictEqual(expected, pdfBuffer);
		});
		it('should log an error if the api call fails', async (ctx) => {
			ctx.mock.method(global, 'fetch', async () => {
				throw new Error('server error occurred');
			});
			const logger = mockLogger();
			const client = new PdfServiceClient(logger, 'http://localhost:3000');

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
			await assert.rejects(
				async () => {
					const pdfBuffer = await client.generatePdf(html);
				},
				{
					message: 'pdf-service-api generatePdf error: server error occurred'
				}
			);

			assert.strictEqual(logger.info.mock.callCount(), 1);
			assert.strictEqual(logger.error.mock.callCount(), 1);
			assert.strictEqual(global.fetch.mock.callCount(), 1);
		});
		it('should log an error if the api call returns not ok response', async (ctx) => {
			ctx.mock.method(global, 'fetch', async () => {
				return { ok: false, status: 400, statusText: 'server error occurred' };
			});
			const logger = mockLogger();
			const client = new PdfServiceClient(logger, 'http://localhost:3000');

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
			await assert.rejects(
				async () => {
					const pdfBuffer = await client.generatePdf(html);
				},
				{
					message: 'server error occurred'
				}
			);

			assert.strictEqual(logger.info.mock.callCount(), 1);
			assert.strictEqual(logger.error.mock.callCount(), 1);
			assert.strictEqual(global.fetch.mock.callCount(), 1);
		});
		it('should log an error if the api call returns not ok response and there is no statusText in api response', async (ctx) => {
			ctx.mock.method(global, 'fetch', async () => {
				return { ok: false, status: 400 };
			});
			const logger = mockLogger();
			const client = new PdfServiceClient(logger, 'http://localhost:3000');

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
			await assert.rejects(
				async () => {
					const pdfBuffer = await client.generatePdf(html);
				},
				{
					message: 'pdf-service-api generatePdf error: status 400'
				}
			);

			assert.strictEqual(logger.info.mock.callCount(), 1);
			assert.strictEqual(logger.error.mock.callCount(), 1);
			assert.strictEqual(global.fetch.mock.callCount(), 1);
		});
	});
});
