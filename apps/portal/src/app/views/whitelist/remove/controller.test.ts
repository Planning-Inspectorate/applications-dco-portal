// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { buildRemoveUserPage, buildSaveController } from './controller.ts';
import assert from 'node:assert';

describe('whitelist remove user controllers', () => {
	describe('buildRemoveUserPage', () => {
		it('should render enter email address page with view data', async () => {
			const mockDb = {
				whitelistUser: {
					findUnique: mock.fn(() => ({
						email: 'test@email.com',
						UserRole: {
							displayName: 'Standard'
						}
					}))
				}
			};
			const mockReq = {
				params: {
					whitelistUserId: 'whitelistUserId-1'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildRemoveUserPage({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/whitelist/remove/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Are you sure you want to remove this user?',
				backLinkUrl: '/manage-users',
				emailAddress: 'test@email.com',
				accessLevel: 'Standard'
			});
		});
		it('should render not found page if whitelist user not returned from db', async () => {
			const mockDb = {
				whitelistUser: {
					findUnique: mock.fn()
				}
			};

			const mockReq = {
				params: {
					whitelistUserId: 'whitelistUserId-1'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildRemoveUserPage({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
		it('should render not found page if whitelistUserId req param not present', async () => {
			const mockReq = {
				params: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildRemoveUserPage({});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
	});
	describe('buildSaveController', () => {
		it('should render enter email address page with view data', async () => {
			const mockDb = {
				whitelistUser: {
					delete: mock.fn(),
					findUnique: mock.fn(() => ({
						email: 'test@email.com'
					}))
				}
			};
			const mockReq = {
				params: {
					whitelistUserId: 'whitelistUserId-1'
				},
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSaveController({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/manage-users');

			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistUpdateMessage:
						'<p class="govuk-notification-banner__heading">test@email.com has been removed from the project</p><p class="govuk-body">They will no longer be able to access the service</p>'
				}
			});
		});
		it('should throw error if error encountered during data deletion', async () => {
			const mockDb = {
				whitelistUser: {
					delete: mock.fn(() => {
						throw new Error('Error', { code: 'E1' });
					}),
					findUnique: mock.fn(() => ({
						email: 'test@email.com'
					}))
				}
			};
			const mockReq = {
				params: {
					whitelistUserId: 'whitelistUserId-1'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSaveController({ db: mockDb, logger: mockLogger() });
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'error removing user from the whitelist' });
		});
		it('should render not found page if whitelistUserId req param not present', async () => {
			const mockReq = {
				params: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildSaveController({});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
	});
});
