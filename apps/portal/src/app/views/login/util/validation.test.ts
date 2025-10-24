// @ts-nocheck

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
	isValidCaseReference,
	isValidEmailAddress,
	isValidOtpCode,
	isValidOtpRecord,
	sentInLastTenSeconds
} from './validation.ts';

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

			assert.strictEqual(isValidOtpRecord({}), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 4 }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 5 }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 3, expiresAt: new Date('2025-01-29T23:35:00.000Z') }), false);
			assert.strictEqual(isValidOtpRecord({ attempts: 2, expiresAt: new Date('2025-01-30T00:02:00.000Z') }), true);
		});
	});
	describe('sentInLastTenSeconds', () => {
		it('should validate OTP record provided', async (ctx) => {
			const now = new Date('2025-01-30T00:01:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			assert.strictEqual(sentInLastTenSeconds({}), false);
			assert.strictEqual(sentInLastTenSeconds(null), false);
			assert.strictEqual(sentInLastTenSeconds(undefined), false);
			assert.strictEqual(sentInLastTenSeconds({ createdAt: new Date('2025-01-30T00:00:50.000Z') }), true);
			assert.strictEqual(sentInLastTenSeconds({ createdAt: new Date('2025-01-30T00:00:51.000Z') }), true);
			assert.strictEqual(sentInLastTenSeconds({ createdAt: new Date('2025-01-30T00:00:00.000Z') }), false);
			assert.strictEqual(sentInLastTenSeconds({ createdAt: new Date('2025-01-29T00:01:00.000Z') }), false);
		});
	});
	describe('isValidCaseReference', () => {
		it('should validate case reference provided', async () => {
			assert.strictEqual(isValidCaseReference('en123456'), true);
			assert.strictEqual(isValidCaseReference('EN123456'), true);
			assert.strictEqual(isValidCaseReference('tR123456'), true);
			assert.strictEqual(isValidCaseReference('BC123456'), true);
			assert.strictEqual(isValidCaseReference('Wa123456'), true);
			assert.strictEqual(isValidCaseReference('ws123456'), true);
			assert.strictEqual(isValidCaseReference('WW123456'), true);
			assert.strictEqual(isValidCaseReference('En123456'), true);
			assert.strictEqual(isValidCaseReference('eN123456'), true);
			assert.strictEqual(isValidCaseReference('E123456'), false);
			assert.strictEqual(isValidCaseReference('E123456'), false);
			assert.strictEqual(isValidCaseReference('E123456'), false);
			assert.strictEqual(isValidCaseReference('E123456'), false);
			assert.strictEqual(isValidCaseReference('EN12345'), false);
			assert.strictEqual(isValidCaseReference('EN12345.'), false);
			assert.strictEqual(isValidCaseReference('EN12345.'), false);
			assert.strictEqual(isValidCaseReference('EN1234567'), false);
			assert.strictEqual(isValidCaseReference('EN12A456'), false);
			assert.strictEqual(isValidCaseReference('123456EN'), false);
		});
	});
});
