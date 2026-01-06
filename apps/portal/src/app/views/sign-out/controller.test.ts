// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSignOutController } from './controller.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('sign-out controller', () => {
	describe('buildSignOutController', () => {
		it('should redirect to login landing page on sign out', async () => {
			const mockReq = {
				session: {
					id: 'session-123',
					caseReference: 'EN123456',
					emailAddress: 'test@email.com',
					isAuthenticated: true,
					destroy(cb) {
						cb(null);
					}
				}
			};

			const mockRes = {
				setHeader: mock.fn(function () {
					return this;
				}),
				clearCookie: mock.fn(function () {
					return this;
				}),
				redirect: mock.fn()
			};

			const controller = buildSignOutController({ logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.setHeader.mock.callCount(), 1);
			assert.deepStrictEqual(mockRes.setHeader.mock.calls[0].arguments, ['Clear-Site-Data', '*']);

			assert.strictEqual(mockRes.clearCookie.mock.callCount(), 2);
			assert.deepStrictEqual(mockRes.clearCookie.mock.calls[0].arguments, ['connect.sid', { path: '/' }]);
			assert.deepStrictEqual(mockRes.clearCookie.mock.calls[1].arguments, ['had-session', { path: '/' }]);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/application-reference-number');
		});
	});
});
