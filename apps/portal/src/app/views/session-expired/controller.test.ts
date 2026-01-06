// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import assert from 'node:assert';
import { buildSessionExpiredController } from './controller.ts';

describe('session-expired controller', () => {
	describe('buildSessionExpiredController', () => {
		it('should render session expired page', async () => {
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildSessionExpiredController({ logger: mockLogger() });
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/session-expired/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				loginUrl: '/login/application-reference-number'
			});
		});
	});
});
