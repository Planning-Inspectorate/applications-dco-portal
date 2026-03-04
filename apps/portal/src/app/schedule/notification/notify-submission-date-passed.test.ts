// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { dispatchSubmissionDatePassedNotifications } from './notify-submission-date-passed.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('dispatchSubmissionDatePassedNotifications', () => {
	it('should send email to cases where submissions date has passed and case not submitted', async (ctx) => {
		const now = new Date('2026-03-04T00:00:00.000Z');
		ctx.mock.timers.enable({ apis: ['Date'], now });

		const mockDb = {
			case: {
				findMany: mock.fn(() => [
					{
						reference: 'EN123457',
						anticipatedDateOfSubmission: new Date(2026, 2, 2)
					},
					{
						reference: 'EN123458',
						anticipatedDateOfSubmission: new Date(2026, 2, 2)
					}
				])
			}
		};
		const mockNotifyClient = {
			sendSubmissionDatePassedNotification: mock.fn()
		};
		const mockRedisClient = {
			del: mock.fn(),
			set: mock.fn(() => true)
		};

		await dispatchSubmissionDatePassedNotifications({
			db: mockDb,
			logger: mockLogger(),
			notifyClient: mockNotifyClient,
			redisClient: mockRedisClient
		});

		assert.strictEqual(mockNotifyClient.sendSubmissionDatePassedNotification.mock.callCount(), 2);
	});
	it('should not send emails if redis key could not be acquired', async (ctx) => {
		const now = new Date('2026-03-04T00:00:00.000Z');
		ctx.mock.timers.enable({ apis: ['Date'], now });

		const mockDb = {
			case: {
				findMany: mock.fn(() => [
					{
						reference: 'EN123457',
						anticipatedDateOfSubmission: new Date(2026, 2, 2)
					},
					{
						reference: 'EN123458',
						anticipatedDateOfSubmission: new Date(2026, 2, 2)
					}
				])
			}
		};
		const mockNotifyClient = {
			sendSubmissionDatePassedNotification: mock.fn()
		};
		const mockRedisClient = {
			del: mock.fn(),
			set: mock.fn(() => false)
		};

		await dispatchSubmissionDatePassedNotifications({
			db: mockDb,
			logger: mockLogger(),
			notifyClient: mockNotifyClient,
			redisClient: mockRedisClient
		});

		assert.strictEqual(mockNotifyClient.sendSubmissionDatePassedNotification.mock.callCount(), 0);
	});
	it('should not send email if no cases returned that have an anticipated submission date two days before', async (ctx) => {
		const now = new Date('2026-03-04T00:00:00.000Z');
		ctx.mock.timers.enable({ apis: ['Date'], now });

		const mockDb = {
			case: {
				findMany: mock.fn(() => [])
			}
		};
		const mockNotifyClient = {
			sendSubmissionDatePassedNotification: mock.fn()
		};
		const mockRedisClient = {
			del: mock.fn(),
			set: mock.fn(() => true)
		};

		await dispatchSubmissionDatePassedNotifications({
			db: mockDb,
			logger: mockLogger(),
			notifyClient: mockNotifyClient,
			redisClient: mockRedisClient
		});

		assert.strictEqual(mockNotifyClient.sendSubmissionDatePassedNotification.mock.callCount(), 0);
	});
	it('should return if one of crucial client interfaces not present', async () => {
		const mockNotifyClient = {
			sendSubmissionDatePassedNotification: mock.fn()
		};
		const mockRedisClient = {
			del: mock.fn(),
			set: mock.fn(() => true)
		};

		await dispatchSubmissionDatePassedNotifications({
			logger: mockLogger(),
			notifyClient: mockNotifyClient,
			redisClient: mockRedisClient
		});

		assert.strictEqual(mockNotifyClient.sendSubmissionDatePassedNotification.mock.callCount(), 0);
	});
});
