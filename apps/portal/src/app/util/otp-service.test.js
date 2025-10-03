/* eslint-env jest */
import * as otpService from '../otp-service.js';
import { jest } from '@jest/globals';

// Mock dependencies (ESM)
jest.unstable_mockModule('../../../../../packages/lib/govnotify/gov-notify-client', () => ({
	sendEmail: jest.fn(() => Promise.resolve('email sent'))
}));

// Mock Prisma client (ESM)
jest.unstable_mockModule('../prisma', () => ({
	otp: {
		create: jest.fn(),
		findFirst: jest.fn(),
		updateMany: jest.fn(),
		deleteMany: jest.fn()
	}
}));
const prisma = (await import('../prisma')).otp;

describe('OTP Service', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('generateOtp', () => {
		it('should generate a 5-letter uppercase OTP', () => {
			const otp = otpService.generateOtp();
			expect(otp).toHaveLength(5);
			expect(otp).toMatch(/^[A-Z]{5}$/);
		});
	});

	describe('createAndSendOtp', () => {
		it('should generate and send an OTP', async () => {
			prisma.otp.deleteMany.mockResolvedValue();
			prisma.otp.create.mockResolvedValue();
			const email = 'test@example.com';
			const otp = await otpService.createAndSendOtp(email);
			expect(otp).toHaveLength(5);
			expect(prisma.otp.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						email,
						code: expect.any(String),
						expiresAt: expect.any(Date),
						used: false,
						attempts: 0
					})
				})
			);
		});
	});

	describe('validateOtp', () => {
		it('should return not_found if no record', async () => {
			prisma.otp.findFirst.mockResolvedValue(null);
			const result = await otpService.validateOtp('a@b.com', 'ABCDE');
			expect(result).toEqual({ valid: false, reason: 'not_found' });
		});

		it('should return used if OTP already used', async () => {
			prisma.otp.findFirst.mockResolvedValue({ used: true });
			const result = await otpService.validateOtp('a@b.com', 'ABCDE');
			expect(result).toEqual({ valid: false, reason: 'used' });
		});

		it('should return expired if OTP expired', async () => {
			prisma.otp.findFirst.mockResolvedValue({
				used: false,
				attempts: 0,
				expiresAt: new Date(Date.now() - 1000),
				code: 'ABCDE'
			});
			const result = await otpService.validateOtp('a@b.com', 'ABCDE');
			expect(result).toEqual({ valid: false, reason: 'expired' });
		});

		it('should return too_many_attempts if attempts >= 4', async () => {
			prisma.otp.findFirst.mockResolvedValue({
				used: false,
				attempts: 4,
				expiresAt: new Date(Date.now() + 10000),
				code: 'ABCDE'
			});
			const result = await otpService.validateOtp('a@b.com', 'ABCDE');
			expect(result).toEqual({ valid: false, reason: 'too_many_attempts' });
		});

		it('should return invalid and increment attempts if OTP does not match', async () => {
			prisma.otp.findFirst.mockResolvedValue({
				used: false,
				attempts: 1,
				expiresAt: new Date(Date.now() + 10000),
				code: 'ABCDE'
			});
			prisma.otp.updateMany.mockResolvedValue();
			const result = await otpService.validateOtp('a@b.com', 'ZZZZZ');
			expect(result).toEqual({ valid: false, reason: 'invalid' });
			expect(prisma.otp.updateMany).toHaveBeenCalled();
		});

		it('should return too_many_attempts if OTP does not match and attempts reach 4', async () => {
			prisma.otp.findFirst.mockResolvedValue({
				used: false,
				attempts: 3,
				expiresAt: new Date(Date.now() + 10000),
				code: 'ABCDE'
			});
			prisma.otp.updateMany.mockResolvedValue();
			const result = await otpService.validateOtp('a@b.com', 'ZZZZZ');
			expect(result).toEqual({ valid: false, reason: 'too_many_attempts' });
			expect(prisma.otp.updateMany).toHaveBeenCalled();
		});

		it('should return valid and mark OTP as used if OTP matches', async () => {
			prisma.otp.findFirst.mockResolvedValue({
				used: false,
				attempts: 0,
				expiresAt: new Date(Date.now() + 10000),
				code: 'ABCDE'
			});
			prisma.otp.updateMany.mockResolvedValue();
			const result = await otpService.validateOtp('a@b.com', 'ABCDE');
			expect(result).toEqual({ valid: true });
			expect(prisma.otp.updateMany).toHaveBeenCalled();
		});
	});
});

export {};
