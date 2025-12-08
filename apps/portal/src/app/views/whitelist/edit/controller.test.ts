// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { buildSaveController } from './controller.ts';
import assert from 'node:assert';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('whitelist edit user controller', () => {
	describe('buildSaveController', () => {
		it('should render enter email address page with view data', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						caseReference: 'EN123456'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(),
					update: mock.fn(),
					count: mock.fn(() => 2)
				}
			};
			const mockReq = {
				baseUrl: '/edit-user',
				params: {
					whitelistUserId: 'whitelistUserId-1'
				},
				session: {
					editUserEmailAddress: 'test@email.com',
					emailAddress: 'bob@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/manage-users');
			assert.strictEqual(mockDb.whitelistUser.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.whitelistUser.update.mock.calls[0].arguments[0], {
				where: {
					id: 'whitelistUserId-1',
					caseReference: 'EN123456',
					caseId: 'case-id-1'
				},
				data: {
					UserRole: {
						connect: {
							id: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			});
			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistUpdateMessage:
						'<p class="govuk-notification-banner__heading">test@email.com is now an admin</p><p class="govuk-body">They can now manage user access on this project.</p>'
				}
			});
		});
		it('should throw error if error encountered whilst updating whitelist user in the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						caseReference: 'EN123456'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(),
					update: mock.fn(() => {
						throw new Error('Error', { code: 'E1' });
					}),
					count: mock.fn(() => 2)
				}
			};
			const mockReq = {
				baseUrl: '/edit-user',
				params: {
					whitelistUserId: 'whitelistUserId-1'
				},
				session: {
					emailAddress: 'bob@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb, logger: mockLogger() });
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'error editing user' });
		});
		it('should redirect to confirm add user page if trying to add admin and 3 already exist', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						caseReference: 'EN123456'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(),
					count: mock.fn(() => 3)
				}
			};
			const mockReq = {
				baseUrl: '/edit-user',
				params: {
					whitelistUserId: 'whitelistUserId-1'
				},
				session: {
					emailAddress: 'bob@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/edit-user/confirm-changes');
			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistError: [
						{
							text: 'You are trying to assign admin rights to a user when there are already a maximum of 3',
							href: '#'
						}
					]
				}
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
		it('should render not found page if caseReference is not present in session', async () => {
			const mockReq = {
				params: {
					whitelistUserId: 'whitelistUserId-1'
				},
				session: {}
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
