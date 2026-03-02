// @ts-nocheck
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { buildNsipProjectFunction } from './impl.ts';

describe('nsip project function', () => {
	it('should save data all data from nsip project message into db when all fields received in message', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			case: {
				findUnique: mock.fn(() => ({
					reference: 'EN123456',
					email: 'test@email.com'
				})),
				update: mock.fn()
			},
			nsipProject: {
				upsert: mock.fn()
			}
		};
		const mockNotifyClient = {
			sendNewSubmissionDateNotification: mock.fn()
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			caseId: '1',
			caseReference: 'EN123456',
			anticipatedDateOfSubmission: new Date(2025, 11, 12),
			projectEmailAddress: 'pins-bo-staff@email.com',
			projectName: 'test@email.com',
			projectDescription: 'Applicant',
			projectLocation: 'John',
			easting: 'Doe',
			northing: 'Test Org'
		};

		const handler = buildNsipProjectFunction({ db: mockDb, notifyClient: mockNotifyClient });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipProject.upsert.mock.callCount(), 1);
		assert.deepStrictEqual(mockDb.nsipProject.upsert.mock.calls[0].arguments[0], {
			where: {
				caseReference: 'EN123456'
			},
			update: {
				caseId: '1',
				caseReference: 'EN123456',
				anticipatedDateOfSubmission: new Date('2025-12-12T00:00:00.000Z'),
				projectEmailAddress: 'pins-bo-staff@email.com',
				projectName: 'test@email.com',
				projectDescription: 'Applicant',
				projectLocation: 'John',
				easting: 'Doe',
				northing: 'Test Org'
			},
			create: {
				caseId: '1',
				caseReference: 'EN123456',
				anticipatedDateOfSubmission: new Date('2025-12-12T00:00:00.000Z'),
				projectEmailAddress: 'pins-bo-staff@email.com',
				projectName: 'test@email.com',
				projectDescription: 'Applicant',
				projectLocation: 'John',
				easting: 'Doe',
				northing: 'Test Org'
			}
		});

		assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);

		assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
		assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
			data: {
				anticipatedDateOfSubmission: new Date('2025-12-12T00:00:00.000Z'),
				projectEmailAddress: 'pins-bo-staff@email.com'
			},
			where: {
				reference: 'EN123456'
			}
		});

		assert.strictEqual(mockNotifyClient.sendNewSubmissionDateNotification.mock.callCount(), 1);
		assert.deepStrictEqual(
			mockNotifyClient.sendNewSubmissionDateNotification.mock.calls[0].arguments[0],
			'test@email.com'
		);
		assert.deepStrictEqual(mockNotifyClient.sendNewSubmissionDateNotification.mock.calls[0].arguments[1], {
			case_reference_number: 'EN123456',
			due_date: '12 December 2025',
			relevant_team_email_address: 'nienquiries@planninginspectorate.gov.uk'
		});

		assert.strictEqual(context.log.mock.callCount(), 1);
	});
	it('should not send new submission date email if the anticipated submission date has not changed', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			case: {
				findUnique: mock.fn(() => ({
					reference: 'EN123456',
					anticipatedDateOfSubmission: new Date(2025, 11, 12)
				})),
				update: mock.fn()
			},
			nsipProject: {
				upsert: mock.fn()
			}
		};
		const mockNotifyClient = {
			sendNewSubmissionDateNotification: mock.fn()
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			caseId: '1',
			caseReference: 'EN123456',
			anticipatedDateOfSubmission: new Date(2025, 11, 12),
			projectEmailAddress: 'pins-bo-staff@email.com',
			projectName: 'test@email.com',
			projectDescription: 'Applicant',
			projectLocation: 'John',
			easting: 'Doe',
			northing: 'Test Org'
		};

		const handler = buildNsipProjectFunction({ db: mockDb, notifyClient: mockNotifyClient });
		await handler(message, context);

		assert.strictEqual(mockNotifyClient.sendNewSubmissionDateNotification.mock.callCount(), 0);
	});
	it('should save data from message into db if only mandatory fields received', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			case: {
				findUnique: mock.fn()
			},
			nsipProject: {
				upsert: mock.fn()
			}
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			caseId: '1',
			caseReference: 'EN123456'
		};

		const handler = buildNsipProjectFunction({ db: mockDb });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipProject.upsert.mock.calls.length, 1);
		assert.deepStrictEqual(mockDb.nsipProject.upsert.mock.calls[0].arguments[0], {
			where: {
				caseReference: 'EN123456'
			},
			update: {
				caseId: '1',
				caseReference: 'EN123456'
			},
			create: {
				caseId: '1',
				caseReference: 'EN123456'
			}
		});

		assert.strictEqual(context.log.mock.callCount(), 1);
	});
	it('should return without processing message if message does not contain required fields', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipProject: {
				upsert: mock.fn()
			}
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			id: '1'
		};

		const handler = buildNsipProjectFunction({ db: mockDb });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipProject.upsert.mock.calls.length, 0);
	});
	it('should throw an error if issue encountered during service bus message consumption', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipProject: {
				upsert: mock.fn(() => {
					throw new Error('Error', { code: 'E1' });
				})
			}
		};
		const context = {
			error: mock.fn()
		};
		const message = {
			caseId: '1',
			caseReference: 'EN123456'
		};

		const handler = buildNsipProjectFunction({ db: mockDb });
		await assert.rejects(() => handler(message, context), {
			message: 'Error during NSIP Project function run: Error'
		});
	});
});
