import { test, describe, mock } from 'node:test';
import assert from 'node:assert';
import * as otpService from '../otp-service.js';

// Manual mock for prisma
const mockPrisma = {
	otp: {
		create: mock.fn(),
		findFirst: mock.fn(),
		updateMany: mock.fn(),
		deleteMany: mock.fn()
	}
};
// Patch otpService to use mockPrisma
otpService.__setPrisma && otpService.__setPrisma(mockPrisma);

// Manual mock for GovNotifyClient
otpService.__setGovNotifyClient &&
	otpService.__setGovNotifyClient({
		sendEmail: mock.fn(() => Promise.resolve('email sent'))
	});

describe('OTP Service', () => {
	test('generateOtp should generate a 5-letter uppercase OTP', () => {
		const otp = otpService.generateOtp();
		assert.strictEqual(otp.length, 5);
		assert.match(otp, /^[A-Z]{5}$/);
	});

	test('createAndSendOtp should generate and send an OTP', async () => {
		mockPrisma.otp.deleteMany = mock.fn(() => Promise.resolve());
		mockPrisma.otp.create = mock.fn(() => Promise.resolve());
		const email = 'test@example.com';
		const otp = await otpService.createAndSendOtp(email);
		assert.strictEqual(otp.length, 5);
		assert.strictEqual(mockPrisma.otp.create.mock.callCount(), 1);
		const callArgs = mockPrisma.otp.create.mock.calls[0].arguments[0];
		assert.strictEqual(callArgs.data.email, email);
		assert.strictEqual(callArgs.data.used, false);
		assert.strictEqual(callArgs.data.attempts, 0);
		assert.ok(callArgs.data.code);
		assert.ok(callArgs.data.expiresAt instanceof Date);
	});
});

export {};
