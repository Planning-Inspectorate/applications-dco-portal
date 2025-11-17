// @ts-nocheck
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { buildNsipServiceUserFunction } from './impl.ts';

describe('nsip service user function', () => {
	it('should save data all data from message into db when all fields received in message', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipServiceUser: {
				upsert: mock.fn()
			}
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			id: '1',
			caseReference: 'EN123456',
			emailAddress: 'test@email.com',
			serviceUserType: 'Applicant',
			firstName: 'John',
			lastName: 'Doe',
			organisation: 'Test Org',
			telephoneNumber: '1234567890',
			addressLine1: 'Building 120',
			addressLine2: 'The Street',
			addressTown: 'Town',
			addressCounty: 'County',
			postcode: 'BA1 1BW',
			addressCountry: 'England'
		};

		const handler = buildNsipServiceUserFunction({ db: mockDb });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipServiceUser.upsert.mock.calls.length, 1);
		assert.deepStrictEqual(mockDb.nsipServiceUser.upsert.mock.calls[0].arguments[0], {
			where: {
				caseReference_email: {
					caseReference: 'EN123456',
					email: 'test@email.com'
				}
			},
			update: {
				id: '1',
				caseReference: 'EN123456',
				email: 'test@email.com',
				serviceUserType: 'Applicant',
				firstName: 'John',
				lastName: 'Doe',
				organisation: 'Test Org',
				telephoneNumber: '1234567890',
				addressLine1: 'Building 120',
				addressLine2: 'The Street',
				addressTown: 'Town',
				addressCounty: 'County',
				postcode: 'BA1 1BW',
				addressCountry: 'England'
			},
			create: {
				id: '1',
				caseReference: 'EN123456',
				email: 'test@email.com',
				serviceUserType: 'Applicant',
				firstName: 'John',
				lastName: 'Doe',
				organisation: 'Test Org',
				telephoneNumber: '1234567890',
				addressLine1: 'Building 120',
				addressLine2: 'The Street',
				addressTown: 'Town',
				addressCounty: 'County',
				postcode: 'BA1 1BW',
				addressCountry: 'England'
			}
		});

		assert.strictEqual(context.log.mock.callCount(), 1);
	});
	it('should save data from message into db if only mandatory fields received', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipServiceUser: {
				upsert: mock.fn()
			}
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			id: '1',
			caseReference: 'EN123456',
			emailAddress: 'test@email.com'
		};

		const handler = buildNsipServiceUserFunction({ db: mockDb });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipServiceUser.upsert.mock.calls.length, 1);
		assert.deepStrictEqual(mockDb.nsipServiceUser.upsert.mock.calls[0].arguments[0], {
			where: {
				caseReference_email: {
					caseReference: 'EN123456',
					email: 'test@email.com'
				}
			},
			update: {
				id: '1',
				caseReference: 'EN123456',
				email: 'test@email.com'
			},
			create: {
				id: '1',
				caseReference: 'EN123456',
				email: 'test@email.com'
			}
		});

		assert.strictEqual(context.log.mock.callCount(), 1);
	});
	it('should return without processing message if message does not contain required fields', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipServiceUser: {
				upsert: mock.fn()
			}
		};
		const context = {
			log: mock.fn()
		};
		const message = {
			id: '1',
			emailAddress: 'test@email.com'
		};

		const handler = buildNsipServiceUserFunction({ db: mockDb });
		await handler(message, context);

		assert.strictEqual(mockDb.nsipServiceUser.upsert.mock.calls.length, 0);
	});
	it('should throw an error if issue encountered during service bus message consumption', async () => {
		const mockDb = {
			$transaction: mock.fn((fn) => fn(mockDb)),
			nsipServiceUser: {
				upsert: mock.fn(() => {
					throw new Error('Error', { code: 'E1' });
				})
			}
		};
		const context = {
			error: mock.fn()
		};
		const message = {
			id: '1',
			caseReference: 'EN123456',
			emailAddress: 'test@email.com'
		};

		const handler = buildNsipServiceUserFunction({ db: mockDb });
		await assert.rejects(() => handler(message, context), {
			message: 'Error during NSIP Service User function run: Error'
		});
	});
});
