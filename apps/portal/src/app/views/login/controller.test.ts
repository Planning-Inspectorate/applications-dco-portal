// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildLoginSuccessController,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController
} from './controller.ts';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { mockOtpCode } from '@pins/dco-portal-lib/testing/mock-otp.ts';
import { buildHomePage } from '../home/controller.ts';

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
		it('should redirect to landing page if valid and correct otp entered', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockHashedOtpCode = await mockOtpCode('ABCDE');
			const mockDb = {
				oneTimePassword: {
					findUnique: mock.fn(() => ({
						hashedOtpCode: mockHashedOtpCode,
						expiresAt: new Date('2025-01-30T00:02:00.000Z')
					})),
					delete: mock.fn()
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
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/login/success');

			assert.strictEqual(mockReq.session.isAuthenticated, true);
			assert.strictEqual(mockReq.session.emailAddress, 'test@email.com');
			assert.strictEqual(mockReq.session.caseReference, 'EN123456');

			assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 1);
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
	describe('buildLoginSuccessController', () => {
		it('should redirect to landing page after successfully initiating the session and case if required', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
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

			const controller = buildLoginSuccessController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

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
							id: 'super-user'
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
		it('should not update whitelist if already populated', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
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
					caseReference: 'EN123456'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildLoginSuccessController({ db: mockDb, logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.upsert.mock.callCount(), 1);
			assert.strictEqual(mockDb.whitelistUser.upsert.mock.callCount(), 0);
		});
		it('should render not found handler if email address not present', async () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const homePage = buildLoginSuccessController({});
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
		});
		it('should render not found handler if case reference not present', async () => {
			const mockReq = {
				session: {
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const homePage = buildLoginSuccessController({});
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
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
});
