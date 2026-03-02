// @ts-nocheck
import { describe, it, mock } from 'node:test';
import { buildTermsAndConditionsPage } from './controller.ts';
import assert from 'node:assert';

describe('buildTermsAndConditionsPage', () => {
	it('should render terms and conditions page', async () => {
		const mockRes = {
			render: mock.fn()
		};

		const cookiesPage = buildTermsAndConditionsPage();
		await cookiesPage({}, mockRes);

		assert.strictEqual(mockRes.render.mock.callCount(), 1);
		assert.strictEqual(
			mockRes.render.mock.calls[0].arguments[0],
			'views/terms-and-conditions/terms-and-conditions.njk'
		);
		assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {});
	});
});
