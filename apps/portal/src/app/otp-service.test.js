import { test, describe } from 'node:test';
import assert from 'node:assert';
import * as otpService from './otp-service.js';
import bcrypt from 'bcrypt';

// Mock db.oneTimePassword
function createMockDb() {
	const store = {};
	return {
		oneTimePassword: {
			create: async ({ data }) => {
				store[data.email] = { ...data };
				return store[data.email];
			},
			findUnique: async ({ where }) => store[where.email] || null,
			deleteMany: async ({ where }) => {
				delete store[where.email];
			},
			delete: async ({ where }) => {
				delete store[where.email];
			},
			update: async ({ where, data }) => {
				if (store[where.email]) {
					store[where.email].attempts += data.attempts.increment;
				}
				return store[where.email];
			}
		}
	};
}

describe('OTP Service', () => {
	test('generateOtp should generate a 5-letter uppercase OTP', () => {
		const otp = otpService.generateOtp();
		assert.strictEqual(otp.length, 5);
		assert.match(otp, /^[A-Z]{5}$/);
	});

	test('saveOtp and getOtpRecord should store and retrieve OTP', async () => {
		const db = createMockDb();
		const email = 'test@example.com';
		const otp = 'ABCDE';
		const expiresAt = new Date(Date.now() + 30 * 60000);
		await otpService.saveOtp(db, email, otp, expiresAt);
		const record = await otpService.getOtpRecord(db, email);
		assert.strictEqual(record.email, email);
		assert.ok(await bcrypt.compare(otp, record.hashed_otp_code));
		assert.strictEqual(record.attempts, 0);
		assert.strictEqual(record.expiresAt, expiresAt);
	});

	test('incrementOtpAttempts should increase attempts', async () => {
		const db = createMockDb();
		const email = 'test2@example.com';
		const otp = 'FGHIJ';
		const expiresAt = new Date(Date.now() + 30 * 60000);
		await otpService.saveOtp(db, email, otp, expiresAt);
		await otpService.incrementOtpAttempts(db, email);
		const record = await otpService.getOtpRecord(db, email);
		assert.strictEqual(record.attempts, 1);
	});

	test('deleteOtp should remove OTP record', async () => {
		const db = createMockDb();
		const email = 'test3@example.com';
		const otp = 'KLMNO';
		const expiresAt = new Date(Date.now() + 30 * 60000);
		await otpService.saveOtp(db, email, otp, expiresAt);
		await otpService.deleteOtp(db, email);
		const record = await otpService.getOtpRecord(db, email);
		assert.strictEqual(record, null);
	});

	test('validateOtp should validate correct, expired, invalid, and too many attempts', async () => {
		const db = createMockDb();
		const email = 'test4@example.com';
		const otp = 'PQRST';
		const expiresAt = new Date(Date.now() + 30 * 60000);
		await otpService.saveOtp(db, email, otp, expiresAt);

		// Valid OTP
		let result = await otpService.validateOtp(db, email, otp);
		assert.deepStrictEqual(result, { valid: true });

		// OTP should be deleted after use
		result = await otpService.validateOtp(db, email, otp);
		assert.deepStrictEqual(result, { valid: false, reason: 'not_found' });

		// Expired OTP
		await otpService.saveOtp(db, email, otp, new Date(Date.now() - 1000));
		result = await otpService.validateOtp(db, email, otp);
		assert.deepStrictEqual(result, { valid: false, reason: 'expired' });

		// Invalid OTP and too many attempts
		await otpService.saveOtp(db, email, otp, expiresAt);
		for (let i = 0; i < 3; i++) {
			if (i < 2) {
				result = await otpService.validateOtp(db, email, 'WRONG');
				assert.deepStrictEqual(result, { valid: false, reason: 'invalid' });
			} else {
				result = await otpService.validateOtp(db, email, 'WRONG');
				assert.deepStrictEqual(result, { valid: false, reason: 'too_many_attempts' });
			}
		}
	});
});
