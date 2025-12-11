// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('nature-conservation-and-environmental-information save', () => {
	describe('buildSaveController', () => {
		it('should save nature conservation and environmental information journey successfully if compulsory acquisition is yes', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1'
					})),
					update: mock.fn()
				},
				supportingEvidence: {
					deleteMany: mock.fn(),
					upsert: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							naturalEnvironmentInformation: 'doc-id-3,doc-id-2',
							hasNaturalEnvironmentInformation: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 2);
		});
		it('should save nature conservation and environmental information journey successfully if compulsory acquisition is no', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1'
					})),
					update: mock.fn()
				},
				supportingEvidence: {
					deleteMany: mock.fn(),
					upsert: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasNaturalEnvironmentInformation: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 0);
		});
		it('should redirect to not found page if the case data is not present in db', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasNaturalEnvironmentInformation: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
		it('should throw error is issue encountered during db transaction to save case data', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1'
					})),
					update: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					})
				},
				supportingEvidence: {
					deleteMany: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							hasNaturalEnvironmentInformation: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving nature conservation and environmental features journey'
			});
		});
	});
});
