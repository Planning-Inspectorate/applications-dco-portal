// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('about the project journey save controller', () => {
	describe('buildSaveController', () => {
		it('should save project details into the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					update: mock.fn(() => 'document-id')
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							description: 'This is a test project description',
							consentReason: 'This is a test consent reason'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ABOUT_THE_PROJECT
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatusId: 'completed'
				}
			});
		});
		it('should throw if error encountered during database operations', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					update: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					})
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							description: 'This is a test project description',
							consentReason: 'This is a test consent reason'
						}
					}
				}
			};
			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ABOUT_THE_PROJECT
			);
			await assert.rejects(() => controller({}, mockRes), { message: 'error saving about the project journey' });
		});
		it('should throw if res.locals is not present', async () => {
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await assert.rejects(() => controller({}, {}), { message: 'journey response required' });
		});
		it('should throw if res.locals.journeyResponse is not present', async () => {
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await assert.rejects(() => controller({}, { locals: {} }), { message: 'journey response required' });
		});
		it('should throw if answers is not an object', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: 'answers'
					}
				}
			};
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await assert.rejects(() => controller({}, mockRes), { message: 'answers should be an object' });
		});
	});
});
