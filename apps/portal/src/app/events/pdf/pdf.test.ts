// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { generatePdf, addCSStoHtml } from './pdf.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('events/pdf/pdf.ts', () => {
	describe('addCSStoHtml', () => {
		//reads a non-transient file location e.g. util.ts itself due to expectation of file resolution.
		const mockStyleFile = 'apps/portal/src/app/views/util.ts';
		const invalidStyleFile = 'apps/portal/src/app/views/doesnotexist.ts';

		const logger = mockLogger();

		it('adds stylefile at static directory to HTML with valid <head> element', async () => {
			const html =
				'<head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

			const result = await addCSStoHtml(html, mockStyleFile, logger);

			assert.strictEqual(result.startsWith('<head><style>'), true);
			assert.strictEqual(logger.error.mock.callCount(), 0);
			assert.strictEqual(
				result.endsWith(
					'<title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>'
				),
				true
			);
		});
		it('returns HTML without CSS added if <head> element absent from HTML', async () => {
			const html = '<body><h1>test html</h2></body>';

			const result = await addCSStoHtml(html, mockStyleFile, logger);

			assert.strictEqual(logger.error.mock.callCount(), 0);
			assert.strictEqual(result, html);
		});
		it('returns HTML without CSS added if multiple <head> elements found in HTML', async () => {
			const html =
				'<head><title>test</title><link rel="stylesheet" href="style.css"></head><head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

			const result = await addCSStoHtml(html, mockStyleFile, logger);

			assert.strictEqual(logger.error.mock.callCount(), 0);
			assert.strictEqual(result, html);
		});
		it('returns HTML without CSS added if stylefile cannot be found', async () => {
			const html =
				'<head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

			const result = await addCSStoHtml(html, invalidStyleFile, logger);

			assert.strictEqual(logger.error.mock.callCount(), 1);
			assert.strictEqual(result, html);
		});
	});
});
