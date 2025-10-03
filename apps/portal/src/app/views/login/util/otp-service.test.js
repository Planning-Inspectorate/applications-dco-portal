import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { deleteOtp, generateOtp, getOtpRecord, incrementOtpAttempts, saveOtp } from './otp-service.js';

describe('OTP Service', () => {
	it('generateOtp should generate a 5-letter uppercase OTP', () => {
		const otp = generateOtp();
		assert.strictEqual(otp.length, 5);
		assert.match(otp, /^[A-Z]{5}$/);
	});

	it('saveOtp should store new otp record in the db', async () => {
		const mockDb = {
			oneTimePassword: {
				create: mock.fn(),
				deleteMany: mock.fn()
			}
		};

		await saveOtp(mockDb, 'test@example.com', 'ABCDE');

		assert.strictEqual(mockDb.oneTimePassword.deleteMany.mock.callCount(), 1);
		assert.strictEqual(mockDb.oneTimePassword.create.mock.callCount(), 1);
	});

	it('getOtpRecord should fetch record from the db for provided email', async () => {
		const mockDb = {
			oneTimePassword: {
				findUnique: mock.fn(() => ({
					id: 'id-1',
					email: 'test@email.com',
					hashedOtpCode: 'H@$HED_C0D3',
					createdAt: new Date('2025-01-29T23:15:00.000Z'),
					expiresAt: new Date('2025-01-29T23:35:00.000Z'),
					attempts: 1
				}))
			}
		};

		const otpRecord = await getOtpRecord(mockDb, 'test@email.com');

		assert.strictEqual(mockDb.oneTimePassword.findUnique.mock.callCount(), 1);
		assert.deepStrictEqual(otpRecord, {
			id: 'id-1',
			email: 'test@email.com',
			hashedOtpCode: 'H@$HED_C0D3',
			createdAt: new Date('2025-01-29T23:15:00.000Z'),
			expiresAt: new Date('2025-01-29T23:35:00.000Z'),
			attempts: 1
		});
	});

	it('deleteOtp should remove OTP record from db', async () => {
		const mockDb = {
			oneTimePassword: {
				delete: mock.fn()
			}
		};

		await deleteOtp(mockDb, 'test@email.com');

		assert.strictEqual(mockDb.oneTimePassword.delete.mock.callCount(), 1);
	});

	it('incrementOtpAttempts should increase attempts value on associated email row in db', async () => {
		const mockDb = {
			oneTimePassword: {
				update: mock.fn()
			}
		};

		await incrementOtpAttempts(mockDb, 'test@email.com');

		assert.strictEqual(mockDb.oneTimePassword.update.mock.callCount(), 1);
		assert.deepStrictEqual(mockDb.oneTimePassword.update.mock.calls[0].arguments[0], {
			where: { email: 'test@email.com' },
			data: { attempts: { increment: 1 } }
		});
	});
});
