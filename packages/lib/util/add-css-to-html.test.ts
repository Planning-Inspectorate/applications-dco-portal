import { addCSStoHtml } from './add-css-to-html.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('lib/add-css-to-html', () => {
	it('adds test.css to HTML with valid <head> element', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html, 'test.css');

		assert.strictEqual(result.startsWith('<head><style>'), true);
		assert.strictEqual(result.includes('.govuk'), true);
		assert.strictEqual(
			result.endsWith(
				'<title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>'
			),
			true
		);
	});
	it('returns HTML without CSS added if <head> element absent from HTML', async () => {
		const html = '<body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html, 'test.css');

		assert.strictEqual(result, html);
	});
	it('returns HTML without CSS added if multiple <head> elements found in HTML', async () => {
		const html =
			'<head><title>test</title><link rel="stylesheet" href="style.css"></head><head><title>test</title><link rel="stylesheet" href="style.css"></head><body><h1>test html</h2></body>';

		const result = await addCSStoHtml(html, 'test.css');

		assert.strictEqual(result, html);
	});
});
