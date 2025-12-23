// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController,
	buildTestSetupCase
} from './controller.ts';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { mockOtpCode } from '@pins/dco-portal-lib/testing/mock-otp.ts';
import { buildHomePage } from '../home/controller.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('login controllers', () => {
	describe('buildEnterEmailPage', () => {
		it('should render enter email address page with view data', async () => {
			const mockRes = { render: mock.fn() };

			const controller = buildEnterEmailPage();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: 'undefined/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				pageTitle: 'Sign-in'
			});
		});
		it('should render enter email address page with errors if in view data', async () => {
			const mockRes = { render: mock.fn() };
			const viewData = {
				errors: { emailAddress: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#emailAddress' }]
			};

			const controller = buildEnterEmailPage(viewData);
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Sign-in',
				caseReferenceQuestionText: 'What is your case reference?',
				backLinkUrl: 'undefined/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				errors: { emailAddress: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#emailAddress' }]
			});
		});
	});
	describe('buildSubmitEmailController', () => {
		it('should dispatch otp code email and redirect to enter code page if valid email address and case reference entered', async () => {
			const mockDb = {
				oneTimePassword: {
					deleteMany: mock.fn(),
					create: mock.fn(),
					findUnique: mock.fn()
				},
				nsipServiceUser: {
					findFirst: mock.fn(() => ({
						email: 'valid@email.com'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({
				db: mockDb,
				logger: mockLogger(),
				notifyClient: mockNotifyClient
			});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/enter-code');

			assert.strictEqual(mockDb.oneTimePassword.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 1);

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 1);
			assert.strictEqual(
				mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[0],
				'valid@email.com'
			);
			assert.ok(mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[1].oneTimePassword);
		});
		it('should redirect back to email page and render errors if a otp requested within 10 seconds', async (ctx) => {
			const now = new Date('2025-01-30T00:00:07.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockDb = {
				oneTimePassword: {
					delete: mock.fn(),
					create: mock.fn(),
					findUnique: mock.fn(() => ({
						createdAt: new Date('2025-01-30T00:00:00.000Z')
					}))
				},
				nsipServiceUser: {
					findFirst: mock.fn(() => ({
						email: 'valid@email.com'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitEmailController({
				db: mockDb,
				logger: mockLogger(),
				notifyClient: mockNotifyClient
			});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Sign-in',
				backLinkUrl: '/login/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				errors: { emailAddress: { msg: 'Code already requested' } },
				errorSummary: [{ text: 'Code already requested', href: '#emailAddress' }]
			});

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
		it('should redirect back to no access page if no service user associated with case reference', async () => {
			const mockDb = {
				nsipServiceUser: {
					findFirst: mock.fn()
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/no-access');
		});
		it('should redirect back to no access page if case reference is whitelisted but email provided does not match service user entry', async () => {
			const mockDb = {
				nsipServiceUser: {
					findFirst: mock.fn(() => ({
						caseReference: 'EN123456',
						email: 'another-email@email.com'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/no-access');
		});
		it('should redirect back to no access page if case reference is whitelisted but email provided does not match whitelist user entry', async () => {
			const mockDb = {
				nsipServiceUser: {
					findFirst: mock.fn()
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						caseReference: 'EN123456',
						email: 'another-email@email.com'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/no-access');
		});
		it('should redirect back to email page and render errors if an invalid email and case reference provided', async () => {
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				body: {
					emailAddress: 'invalid.com'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), notifyClient: mockNotifyClient });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Sign-in',
				backLinkUrl: 'undefined/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				errors: {
					emailAddress: { msg: 'Invalid email address' },
					caseReference: { msg: 'You must provide a valid case reference' }
				},
				errorSummary: [
					{ text: 'Invalid email address', href: '#emailAddress' },
					{ text: 'You must provide a valid case reference', href: '#caseReference' }
				]
			});

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
		it('should redirect back to email page and render errors if an invalid email is provided', async () => {
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				body: {
					emailAddress: 'invalid.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), notifyClient: mockNotifyClient });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Sign-in',
				backLinkUrl: 'undefined/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				errors: {
					emailAddress: { msg: 'Invalid email address' }
				},
				errorSummary: [{ text: 'Invalid email address', href: '#emailAddress' }]
			});

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
		it('should redirect back to email page and render errors if an invalid case reference is provided', async () => {
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN1234567'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), notifyClient: mockNotifyClient });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Sign-in',
				backLinkUrl: 'undefined/application-reference-number',
				caseReferenceHintText:
					'You can find this in the email inviting you to sign in to this service. For example, EN012345',
				caseReferenceQuestionText: 'Application reference number',
				emailQuestionText: 'Email address',
				errors: { caseReference: { msg: 'You must provide a valid case reference' } },
				errorSummary: [{ text: 'You must provide a valid case reference', href: '#caseReference' }]
			});

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
		it('should use fixed ABCDE otp and skip Notify when enableE2eTestEndpoints=true', async () => {
			const mockDb = {
				oneTimePassword: {
					deleteMany: mock.fn(),
					create: mock.fn(),
					findUnique: mock.fn(() => null)
				},
				nsipServiceUser: {
					findFirst: mock.fn(() => ({
						email: 'valid@email.com'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};

			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};

			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};

			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({
				db: mockDb,
				logger: mockLogger(),
				notifyClient: mockNotifyClient,
				enableE2eTestEndpoints: true
			});

			await controller(mockReq, mockRes);

			// redirect to OTP page
			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/enter-code');

			// should still store an OTP record
			assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 1);

			// should be the fixed test OTP
			const createArgs = mockDb.oneTimePassword.create.mock.calls[0].arguments[0];
			assert.ok(createArgs?.data);
			assert.strictEqual(createArgs.data.email, 'valid@email.com');
			assert.strictEqual(createArgs.data.caseReference, 'EN123456');
			assert.ok(typeof createArgs.data.hashedOtpCode === 'string' && createArgs.data.hashedOtpCode.length > 0);

			// and it should NOT send via Notify in test mode
			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);

			// should set session values
			assert.strictEqual(mockReq.session.emailAddress, 'valid@email.com');
			assert.strictEqual(mockReq.session.caseReference, 'EN123456');
		});

		it('should not block with "Code already requested" when enableE2eTestEndpoints=true (overwrites OTP)', async (ctx) => {
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						createdAt: new Date('2025-01-30T00:00:00.000Z'),
						hashedOtpCode: 'hash',
						otpAttempts: 0
					})),
					delete: mock.fn(),
					deleteMany: mock.fn(),
					create: mock.fn()
				},
				nsipServiceUser: {
					findFirst: mock.fn(() => ({ email: 'valid@email.com' }))
				},
				whitelistUser: {
					findUnique: mock.fn()
				}
			};

			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};

			const mockReq = {
				baseUrl: '/login',
				body: {
					emailAddress: 'valid@email.com',
					caseReference: 'EN123456'
				},
				session: {}
			};

			const mockRes = { redirect: mock.fn(), render: mock.fn() };

			const controller = buildSubmitEmailController({
				db: mockDb,
				logger: mockLogger(),
				notifyClient: mockNotifyClient,
				enableE2eTestEndpoints: true
			});

			await controller(mockReq, mockRes);

			// Should NOT render the "code already requested" error
			assert.strictEqual(mockRes.render.mock.callCount(), 0);

			// Should proceed to enter-code
			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/enter-code');

			// In E2E mode we overwrite the OTP (delete + create)
			assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 1);
			assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 1);

			// Should NOT send via Notify in test mode
			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);

			// Session should be set
			assert.strictEqual(mockReq.session.emailAddress, 'valid@email.com');
			assert.strictEqual(mockReq.session.caseReference, 'EN123456');
		});
	});
	describe('buildEnterOtpPage', () => {
		it('should render enter otp page with view data', async () => {
			const mockReq = {
				baseUrl: '/login'
			};
			const mockRes = { render: mock.fn() };

			const controller = buildEnterOtpPage();
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in'
			});
		});
		it('should render enter otp page with errors if in view data', async () => {
			const mockReq = {
				baseUrl: '/login'
			};
			const mockRes = { render: mock.fn() };
			const viewData = {
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			};

			const controller = buildEnterOtpPage(viewData);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in',
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			});
		});
	});
	describe('buildSubmitOtpController', () => {
		it('should initialise case and whitelist then redirect to landing page if valid and correct otp entered', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					delete: mock.fn()
				},
				case: {
					upsert: mock.fn(() => ({
						id: 'case-id-1',
						Whitelist: []
					}))
				},
				whitelistUser: {
					upsert: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456',
					regenerate: mock.fn((callback) => {
						callback(null);
					})
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockReq.session.regenerate.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockReq.session.isAuthenticated, true);
			assert.strictEqual(mockReq.session.emailAddress, 'test@email.com');
			assert.strictEqual(mockReq.session.caseReference, 'EN123456');

			assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 1);

			assert.strictEqual(mockDb.case.upsert.mock.callCount(), 1);

			assert.strictEqual(mockDb.whitelistUser.upsert.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.whitelistUser.upsert.mock.calls[0].arguments[0], {
				where: {
					caseReference_email: { caseReference: 'EN123456', email: 'test@email.com' }
				},
				update: {},
				create: {
					caseReference: 'EN123456',
					email: 'test@email.com',
					isInitialInvitee: true,
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
		});
		it('should initialise case but not whitelist if already exists then redirect to landing page if valid and correct otp entered', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					delete: mock.fn()
				},
				case: {
					upsert: mock.fn(() => ({
						id: 'case-id-1',
						Whitelist: [
							{
								caseReference: 'EN123456',
								email: 'test@email.com',
								isInitialInvitee: true,
								userRoleId: 'super-user'
							}
						]
					}))
				},
				whitelistUser: {
					upsert: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456',
					regenerate: mock.fn((callback) => {
						callback(null);
					})
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockReq.session.regenerate.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockReq.session.isAuthenticated, true);
			assert.strictEqual(mockReq.session.emailAddress, 'test@email.com');
			assert.strictEqual(mockReq.session.caseReference, 'EN123456');

			assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 1);

			assert.strictEqual(mockDb.case.upsert.mock.callCount(), 1);

			assert.strictEqual(mockDb.case.upsert.mock.callCount(), 1);
			assert.strictEqual(mockDb.whitelistUser.upsert.mock.callCount(), 0);
		});
		it('should redirect back to enter otp page if is not a match', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					update: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'EDCBA'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in',
				errors: { otpCode: { msg: 'Provided OTP does not match stored OTP' } },
				errorSummary: [{ text: 'Provided OTP does not match stored OTP', href: '#otpCode' }]
			});
		});
		it('should redirect back to enter email page if email address and case reference not in session', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					update: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'EDCBA'
				},
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/application-reference-number');
		});
		it('should redirect to request new code number of attempts exceeds 4', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z'),
						attempts: 5
					})),
					update: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/request-new-code');
		});
		it('should redirect to request new code number of attempts is equal to 4', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z'),
						attempts: 4
					})),
					update: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/request-new-code');
		});
		it('should redirect back to enter otp page if record not returned from db', async () => {
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => null)
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/request-new-code');
		});
		it('should redirect back to enter otp page if the otp has expired', async (ctx) => {
			const now = new Date('2025-01-30T00:05:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					update: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDE'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/request-new-code');
		});
		it('should redirect back to enter otp page when otp code contains numbers', async () => {
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn()
				}
			};

			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABC12'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in',
				errors: { otpCode: { msg: 'Provided OTP failed validation' } },
				errorSummary: [{ text: 'Provided OTP failed validation', href: '#otpCode' }]
			});
		});
		it('should redirect back to enter otp page when otp code is empty', async () => {
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: ''
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in',
				errors: { otpCode: { msg: 'Provided OTP failed validation' } },
				errorSummary: [{ text: 'Provided OTP failed validation', href: '#otpCode' }]
			});
		});
		it('should redirect back to enter otp page when otp code is longer than 5 chars', async () => {
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/login',
				body: {
					otpCode: 'ABCDEF'
				},
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/login/sign-in',
				errors: { otpCode: { msg: 'Provided OTP failed validation' } },
				errorSummary: [{ text: 'Provided OTP failed validation', href: '#otpCode' }]
			});
		});
	});
	describe('buildRequestNewCodePage', () => {
		it('should render request new otp code page with view data', async () => {
			const mockReq = {
				baseUrl: '/login'
			};
			const mockRes = { render: mock.fn() };

			const controller = buildRequestNewCodePage();
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/request-new-code.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Request a new code',
				backLinkUrl: '/login/enter-code'
			});
		});
	});
	describe('buildSubmitNewCodeRequestController', () => {
		it('should redirect back to enter code page', async () => {
			const mockDb = {
				oneTimePassword: {
					deleteMany: mock.fn(),
					create: mock.fn()
				}
			};
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				baseUrl: '/login',
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitNewCodeRequestController({
				db: mockDb,
				notifyClient: mockNotifyClient,
				logger: mockLogger()
			});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/enter-code');

			assert.strictEqual(mockDb.oneTimePassword.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 1);

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 1);
			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[0], 'test@email.com');
			assert.ok(mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[1].oneTimePassword);
		});
		it('should redirect back to enter email page if email address and case reference not in session', async () => {
			const mockDb = {
				oneTimePassword: {
					delete: mock.fn(),
					create: mock.fn()
				}
			};
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				baseUrl: '/login',
				session: {}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitNewCodeRequestController({
				db: mockDb,
				notifyClient: mockNotifyClient,
				logger: mockLogger()
			});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/sign-in');

			assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 0);
			assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 0);

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
	});
	describe('buildNoAccessPage', () => {
		it('should render no access page with view data', async () => {
			const mockRes = { render: mock.fn() };

			const controller = buildNoAccessPage();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/no-access.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'You do not have access to this service'
			});
		});
	});
	describe('buildTestSetupCase', () => {
		it('should return 404 when enableE2eTestEndpoints is false', async () => {
			const mockDb = {
				$transaction: mock.fn(),
				case: { upsert: mock.fn() },
				whitelistUser: { upsert: mock.fn() }
			};

			const service = {
				db: mockDb,
				logger: mockLogger(),
				enableE2eTestEndpoints: false,
				testToolsToken: 'secret'
			};

			const mockReq = {
				get: mock.fn(() => 'secret'),
				body: { emailAddress: 'valid@email.com', caseReference: 'EN123456' }
			};

			const mockRes = {
				status: mock.fn(() => mockRes),
				send: mock.fn()
			};

			const controller = buildTestSetupCase(service as any);
			await controller(mockReq as any, mockRes as any);

			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.calls[0].arguments[0], 404);
			assert.strictEqual(mockRes.send.mock.callCount(), 1);
			assert.strictEqual(mockDb.$transaction.mock.callCount(), 0);
		});

		it('should return 404 when token is missing', async () => {
			const mockDb = {
				$transaction: mock.fn(),
				case: { upsert: mock.fn() },
				whitelistUser: { upsert: mock.fn() }
			};

			const service = {
				db: mockDb,
				logger: mockLogger(),
				enableE2eTestEndpoints: true,
				testToolsToken: 'secret'
			};

			const mockReq = {
				get: mock.fn(() => undefined),
				body: { emailAddress: 'valid@email.com', caseReference: 'EN123456' }
			};

			const mockRes = {
				status: mock.fn(() => mockRes),
				send: mock.fn()
			};

			const controller = buildTestSetupCase(service as any);
			await controller(mockReq as any, mockRes as any);

			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.calls[0].arguments[0], 404);
			assert.strictEqual(mockRes.send.mock.callCount(), 1);
			assert.strictEqual(mockDb.$transaction.mock.callCount(), 0);
		});

		it('should return 404 when token is incorrect', async () => {
			const mockDb = {
				$transaction: mock.fn(),
				case: { upsert: mock.fn() },
				whitelistUser: { upsert: mock.fn() }
			};

			const service = {
				db: mockDb,
				logger: mockLogger(),
				enableE2eTestEndpoints: true,
				testToolsToken: 'secret'
			};

			const mockReq = {
				get: mock.fn(() => 'wrong-token'),
				body: { emailAddress: 'valid@email.com', caseReference: 'EN123456' }
			};

			const mockRes = {
				status: mock.fn(() => mockRes),
				send: mock.fn()
			};

			const controller = buildTestSetupCase(service as any);
			await controller(mockReq as any, mockRes as any);

			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.calls[0].arguments[0], 404);
			assert.strictEqual(mockRes.send.mock.callCount(), 1);
			assert.strictEqual(mockDb.$transaction.mock.callCount(), 0);
		});

		it('should return 400 when emailAddress or caseReference missing', async () => {
			const mockDb = {
				$transaction: mock.fn(),
				case: { upsert: mock.fn() },
				whitelistUser: { upsert: mock.fn() }
			};

			const service = {
				db: mockDb,
				logger: mockLogger(),
				enableE2eTestEndpoints: true,
				testToolsToken: 'secret'
			};

			const mockReq = {
				get: mock.fn(() => 'secret'),
				body: { emailAddress: 'valid@email.com' } // missing caseReference
			};

			const mockRes = {
				status: mock.fn(() => mockRes),
				send: mock.fn()
			};

			const controller = buildTestSetupCase(service as any);
			await controller(mockReq as any, mockRes as any);

			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.calls[0].arguments[0], 400);
			assert.strictEqual(mockRes.send.mock.callCount(), 1);
			assert.strictEqual(mockRes.send.mock.calls[0].arguments[0], 'emailAddress and caseReference are required');
			assert.strictEqual(mockDb.$transaction.mock.callCount(), 0);
		});

		it('should upsert case + whitelist and return 204 when valid', async () => {
			const mockTx = {
				case: {
					upsert: mock.fn(() => ({ id: 'case-id-1' }))
				},
				whitelistUser: {
					upsert: mock.fn()
				}
			};

			const mockDb = {
				$transaction: mock.fn((fn: any) => fn(mockTx))
			};

			const service = {
				db: mockDb,
				logger: mockLogger(),
				enableE2eTestEndpoints: true,
				testToolsToken: 'secret'
			};

			const mockReq = {
				get: mock.fn(() => 'secret'),
				body: { emailAddress: 'valid@email.com', caseReference: 'EN123456' }
			};

			const mockRes = {
				status: mock.fn(() => mockRes),
				send: mock.fn()
			};

			const controller = buildTestSetupCase(service as any);
			await controller(mockReq as any, mockRes as any);

			assert.strictEqual(mockDb.$transaction.mock.callCount(), 1);

			// case upsert called
			assert.strictEqual(mockTx.case.upsert.mock.callCount(), 1);
			const caseUpsertArgs = mockTx.case.upsert.mock.calls[0].arguments[0];
			assert.deepStrictEqual(caseUpsertArgs.where, { reference: 'EN123456' });
			assert.deepStrictEqual(caseUpsertArgs.update, { email: 'valid@email.com' });
			assert.deepStrictEqual(caseUpsertArgs.create, { reference: 'EN123456', email: 'valid@email.com' });

			// whitelist upsert called
			assert.strictEqual(mockTx.whitelistUser.upsert.mock.callCount(), 1);
			const whitelistArgs = mockTx.whitelistUser.upsert.mock.calls[0].arguments[0];
			assert.deepStrictEqual(whitelistArgs.where, {
				caseReference_email: { caseReference: 'EN123456', email: 'valid@email.com' }
			});

			// response 204
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.calls[0].arguments[0], 204);
			assert.strictEqual(mockRes.send.mock.callCount(), 1);
		});
	});
});
