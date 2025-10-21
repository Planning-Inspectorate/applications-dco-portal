// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildHomePage } from './controller.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { configureNunjucks } from '../../nunjucks.ts';

describe('home page', () => {
	it('should render without error', async () => {
		const nunjucks = configureNunjucks();
		// mock response that calls nunjucks to render a result
		const mockRes = {
			render: mock.fn((view, data) => nunjucks.render(view, data))
		};
		const mockReq = {
			session: {}
		};
		const mockDb = {
			$queryRaw: mock.fn()
		};
		const homePage = buildHomePage({ db: mockDb, logger: mockLogger() });
		await assert.doesNotReject(() => homePage(mockReq, mockRes));
		assert.strictEqual(mockRes.render.mock.callCount(), 1);
		assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
		assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
		assert.strictEqual(mockRes.render.mock.calls[0].arguments[1].pageTitle, 'Application reference number');
	});
});
