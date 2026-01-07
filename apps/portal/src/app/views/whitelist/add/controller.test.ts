// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './controller.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('whitelist add user controller', () => {
	describe('buildSaveController', () => {
		it('should create whitelist user and redirect to whitelist landing page', async () => {
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
					create: mock.fn(),
					count: mock.fn(() => 2)
				}
			};
			const mockNotifyClient = {
				sendWhitelistAddNotification: mock.fn()
			};
			const mockReq = {
				baseUrl: '/add-user',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							emailAddress: 'bob@email.com',
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb, notifyClient: mockNotifyClient });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/manage-users');
			assert.strictEqual(mockDb.whitelistUser.create.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.whitelistUser.create.mock.calls[0].arguments[0], {
				data: {
					caseReference: 'EN123456',
					email: 'bob@email.com',
					UserRole: {
						connect: {
							id: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					},
					Case: {
						connect: {
							id: 'case-id-1'
						}
					}
				}
			});
			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistUpdateMessage:
						'<p class="govuk-notification-banner__heading">bob@email.com as been added to the project</p><p class="govuk-body">They will get an email with a link to the service.</p>'
				}
			});

			assert.strictEqual(mockNotifyClient.sendWhitelistAddNotification.mock.callCount(), 1);
			assert.deepStrictEqual(mockNotifyClient.sendWhitelistAddNotification.mock.calls[0].arguments, [
				'bob@email.com',
				{
					case_reference_number: 'EN123456',
					relevant_team_email_address: 'enquiries@planninginspectorate.gov.uk'
				}
			]);
		});
		it('should throw error if error encountered whilst creating whitelist user in the database', async () => {
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
					create: mock.fn(() => {
						throw new Error('Error', { code: 'E1' });
					}),
					count: mock.fn(() => 2)
				}
			};
			const mockReq = {
				baseUrl: '/add-user',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							emailAddress: 'bob@email.com',
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb, logger: mockLogger() });
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'error adding new user' });
		});
		it('should redirect to confirm add user page if trying to add user that already exists', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						caseReference: 'EN123456'
					}))
				},
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
				baseUrl: '/add-user',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							emailAddress: 'test@email.com',
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/add-user/confirm-add-user');
			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistError: [
						{
							text: 'You are trying to add a user who already exists on the whitelist',
							href: '#'
						}
					]
				}
			});
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
				baseUrl: '/add-user',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							emailAddress: 'bob@email.com',
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/add-user/confirm-add-user');
			assert.deepStrictEqual(mockReq.session.cases, {
				EN123456: {
					whitelistError: [
						{
							text: 'You are trying to add an admin user when there are already a maximum of 3',
							href: '#'
						}
					]
				}
			});
		});
		it('should render not found page if caseReference not present in session', async () => {
			const mockReq = {
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
		it('should render not found page if whitelistUserId req param not present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							emailAddress: 'test@email.com',
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};

			const controller = buildSaveController({ db: mockDb });
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
