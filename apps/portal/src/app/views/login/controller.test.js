import { describe, it, mock } from 'node:test';
import {
	buildEnterEmailPage,
	buildEnterOtpPage,
	buildNoAccessPage,
	buildRequestNewCodePage,
	buildSubmitEmailController,
	buildSubmitNewCodeRequestController,
	buildSubmitOtpController
} from './controller.js';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.js';

describe('login controllers', () => {
	describe('buildEnterEmailPage', () => {
		it('should render enter email address page with view data', async () => {
			const mockRes = { render: mock.fn() };

			const controller = buildEnterEmailPage();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'What is your email address?',
				hintText: 'If we recognise this address, we will send you a code.',
				backLinkUrl: '/'
			});
		});
		it('should render enter email address page with errors if in view data', async () => {
			const mockRes = { render: mock.fn() };
			const viewData = {
				errors: { emailAddress: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#emailAddress' }]
			};

			const controller = buildEnterEmailPage();
			await controller({}, mockRes, viewData);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/email.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'What is your email address?',
				hintText: 'If we recognise this address, we will send you a code.',
				backLinkUrl: '/',
				errors: { emailAddress: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#emailAddress' }]
			});
		});
	});
	describe('buildSubmitEmailController', () => {
		it('should dispatch otp code email and redirect to enter code page if valid email address entered', async () => {
			const mockNotifyClient = {
				sendOneTimePasswordNotification: mock.fn()
			};
			const mockReq = {
				body: {
					emailAddress: 'valid@email.com'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitEmailController({ logger: mockLogger(), notifyClient: mockNotifyClient });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/enter-code');

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 1);
			assert.strictEqual(
				mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[0],
				'valid@email.com'
			);
			assert.deepStrictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.calls[0].arguments[1], {
				oneTimePassword: 'ABCDE'
			});
		});
		it('should dispatch otp code email and redirect to enter code page if valid email address entered', async () => {
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
				questionText: 'What is your email address?',
				hintText: 'If we recognise this address, we will send you a code.',
				backLinkUrl: '/',
				errors: { emailAddress: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#emailAddress' }]
			});

			assert.strictEqual(mockNotifyClient.sendOneTimePasswordNotification.mock.callCount(), 0);
		});
	});
	describe('buildEnterOtpPage', () => {
		it('should render enter otp page with view data', async () => {
			const mockRes = { render: mock.fn() };

			const controller = buildEnterOtpPage();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/email-address'
			});
		});
		it('should render enter otp page with errors if in view data', async () => {
			const mockRes = { render: mock.fn() };
			const viewData = {
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			};

			const controller = buildEnterOtpPage();
			await controller({}, mockRes, viewData);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/email-address',
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			});
		});
	});
	describe('buildSubmitOtpController', () => {
		it('should dispatch otp code email and redirect to enter code page if valid email address entered', async () => {
			const mockReq = {
				body: {
					otpCode: 'ABCDE'
				}
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitOtpController({ logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');
		});
		it('should redirect back to enter otp page when otp code contains numbers', async () => {
			const mockReq = {
				body: {
					otpCode: 'ABC12'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/email-address',
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			});
		});
		it('should redirect back to enter otp page when otp code is empty', async () => {
			const mockReq = {
				body: {
					otpCode: ''
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/email-address',
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			});
		});
		it('should redirect back to enter otp page when otp code is longer than 5 chars', async () => {
			const mockReq = {
				body: {
					otpCode: 'ABCDEF'
				}
			};
			const mockRes = { render: mock.fn() };

			const controller = buildSubmitOtpController({ logger: mockLogger() });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/otp.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Enter the code we sent to your email address',
				backLinkUrl: '/email-address',
				errors: { otpCode: { msg: 'Error message' } },
				errorSummary: [{ text: 'Error message', href: '#otpCode' }]
			});
		});
	});
	describe('buildRequestNewCodePage', () => {
		it('should render request new otp code page with view data', async () => {
			const mockRes = { render: mock.fn() };

			const controller = buildRequestNewCodePage();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/login/request-new-code.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				questionText: 'Request a new code',
				backLinkUrl: '/enter-code'
			});
		});
	});
	describe('buildSubmitNewCodeRequestController', () => {
		it('should redirect back to enter code page', async () => {
			const mockRes = { redirect: mock.fn() };

			const controller = buildSubmitNewCodeRequestController();
			await controller({}, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/enter-code');
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
