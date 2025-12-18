// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';

describe('other-plans-and-reports save', () => {
	describe('buildSaveController', () => {
		it('should save other plans and reports journey successfully', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						Documents: [
							{
								id: 'doc-id-3',
								subCategoryId: 'floor-plans'
							},
							{
								id: 'doc-id-2',
								subCategoryId: 'potential-main-issues-for-the-examination-pmie'
							}
						]
					})),
					update: mock.fn()
				},
				supportingEvidence: {
					deleteMany: mock.fn(),
					upsert: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							otherPlansDrawingsSections: 'doc-id-3',
							otherInformation: 'doc-id-2'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 2);
		});
		it('should redirect to not found page if the case data is not present in db', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/other-plans-and-reports',
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
							otherPlansDrawingsSections: 'doc-id-3',
							otherInformation: 'doc-id-2'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
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
		it('should throw error if issue encountered during db transaction to save case data', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						Documents: [
							{
								id: 'doc-id-3',
								subCategoryId: 'floor-plans'
							},
							{
								id: 'doc-id-2',
								subCategoryId: 'potential-main-issues-for-the-examination-pmie'
							}
						]
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
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							otherPlansDrawingsSections: 'doc-id-3',
							otherInformation: 'doc-id-2'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving other plans and reports journey'
			});
		});
		it('should throw error if answered document id cannot be found again in db', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						Documents: [
							{
								id: 'doc-id-1',
								subCategoryId: 'floor-plans'
							},
							{
								id: 'doc-id-2',
								subCategoryId: 'potential-main-issues-for-the-examination-pmie'
							}
						]
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
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							otherPlansDrawingsSections: 'doc-id-3',
							otherInformation: 'doc-id-2'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving other plans and reports journey'
			});
		});
	});
});
