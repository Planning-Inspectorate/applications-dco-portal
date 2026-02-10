// @ts-nocheck
import { describe, it, mock } from 'node:test';
import { buildContactPage } from './controller.ts';
import assert from 'node:assert';

describe('buildContactPage', () => {
	it('should render cookies page', async () => {
		const mockRes = {
			render: mock.fn()
		};

		const contactPage = buildContactPage();
		await contactPage({}, mockRes);

		assert.strictEqual(mockRes.render.mock.callCount(), 1);
		assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/contact/contact.njk');
		assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {});
	});
});
