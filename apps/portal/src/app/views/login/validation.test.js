import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidEmailAddress, isValidOtpCode } from './validation.js';

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
});
