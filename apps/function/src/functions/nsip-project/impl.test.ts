// @ts-nocheck
import assert from 'node:assert';
import { describe, it, mock } from 'node:test';
import { buildNsipProjectFunction } from './impl.ts';

describe('nsip service user function', () => {
	it('should save data from message into db', async () => {
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
			serviceUserType: 'Applicant',
			emailAddress: 'test@email.com'
		};

		const handler = buildNsipProjectFunction({ db: mockDb });
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
				serviceUserType: 'Applicant',
				email: 'test@email.com'
			},
			create: {
				id: '1',
				caseReference: 'EN123456',
				serviceUserType: 'Applicant',
				email: 'test@email.com'
			}
		});

		assert.strictEqual(context.log.mock.callCount(), 1);
	});
	// it('should throw an error if issue encountered during service bus message consumption', async () => {
	// 	const mockDb = {
	// 		$transaction: mock.fn((fn) => fn(mockDb)),
	// 		nsipServiceUser: {
	// 			upsert: mock.fn(() => {
	// 				throw new Error('Error', { code: 'E1' });
	// 			})
	// 		}
	// 	};
	// 	const context = {
	// 		error: mock.fn()
	// 	};
	// 	const message = {
	// 		id: '1',
	// 		caseReference: 'EN123456',
	// 		serviceUserType: 'Applicant',
	// 		emailAddress: 'test@email.com'
	// 	};
	//
	// 	const handler = buildNsipProjectFunction({ db: mockDb });
	// 	await assert.rejects(() => handler(message, context), {
	// 		message: 'Error during NSIP Service User function run: Error'
	// 	});
	// });
});
