// @ts-nocheck
import { describe, it, mock } from 'node:test';
import { buildCookiesPage } from './controller.ts';
import assert from 'node:assert';

describe('buildCookiesPage', () => {
	it('should render cookies page', async () => {
		const mockRes = {
			render: mock.fn()
		};

		const cookiesPage = buildCookiesPage();
		await cookiesPage({}, mockRes);

		assert.strictEqual(mockRes.render.mock.callCount(), 1);
		assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/cookies/cookies.njk');
		assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {});
	});
});
