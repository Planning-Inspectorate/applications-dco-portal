import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidEmailAddress, isValidOtpCode, isValidOtpRecord } from './validation.ts';

describe('login validation', () => {
	describe('isValidEmailAddress', () => {
		it('should validate email address provided', async () => {
			assert.strictEqual(isValidEmailAddress('valid@email.com'), true);
			assert.strictEqual(isValidEmailAddress('@email.com'), false);
			assert.strictEqual(isValidEmailAddress('valid@.com'), false);
			assert.strictEqual(isValidEmailAddress('valid@email.'), false);
			assert.strictEqual(isValidEmailAddress(''), false);
			assert.strictEqual(isValidEmailAddress('.com'), false);
			assert.strictEqual(isValidEmailAddress('@.'), false);
		});
	});
	describe('isValidOtpCode', () => {
		it('should validate OTP code provided', async () => {
			assert.strictEqual(isValidOtpCode('ABCDE'), true);
			assert.strictEqual(isValidOtpCode('abcde'), true);
			assert.strictEqual(isValidOtpCode('abcd1'), false);
			assert.strictEqual(isValidOtpCode('a3cde'), false);
			assert.strictEqual(isValidOtpCode(''), false);
			assert.strictEqual(isValidOtpCode('ABCDEF'), false);
			assert.strictEqual(isValidOtpCode('abcdef'), false);
		});
	});
	describe('isValidOtpRecord', () => {
		it('should validate OTP record provided', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			assert.strictEqual(isValidOtpRecord(null), false);
			assert.strictEqual(isValidOtpRecord(undefined), false);
			assert.strictEqual(isValidOtpRecord(''), false);
			assert.strictEqual(isValidOtpRecord('string'), false);
			assert.strictEqual(isValidOtpRecord({}), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 4 }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 5 }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 3, expiresAt: new Date('2025-01-29T23:35:00.000Z') }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 3, expiresAt: new Date('2025-01-30T00:02:00.000Z') }), true);
		});
	});
});
