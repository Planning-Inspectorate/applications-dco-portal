// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('file upload journey save controller', () => {
	describe('buildSaveController', () => {
		it('should save uploaded documents into the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						id: 'case-id-1',
						reference: 'EN123456'
					}))
				},
				document: {
					create: mock.fn(async () => 'document-id')
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							apfpRegulation: '5-1',
							isCertified: 'yes',
							documentType: 'draft-development-consent-order',
							fileUpload: [
								{
									fileName: 'test.pdf',
									size: 208,
									formattedSize: '208B',
									blobName: `EN123456/draft-dco/test.pdf`
								},
								{
									fileName: 'plan.pdf',
									size: 500,
									formattedSize: '500B',
									blobName: `EN123456/draft-dco/plan.pdf`
								}
							]
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				DOCUMENT_CATEGORY_ID.DRAFT_DCO
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/draft-dco');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.document.create.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.document.create.mock.calls[0].arguments[0], {
				data: {
					fileName: 'test.pdf',
					size: 208,
					blobName: 'EN123456/draft-dco/test.pdf',
					isCertified: true,
					SubCategory: {
						connect: {
							id: 'draft-development-consent-order'
						}
					},
					ApfpRegulation: {
						connect: {
							id: '5-1'
						}
					},
					Case: {
						connect: {
							id: 'case-id-1'
						}
					}
				}
			});
			assert.deepStrictEqual(mockDb.document.create.mock.calls[1].arguments[0], {
				data: {
					fileName: 'plan.pdf',
					size: 500,
					blobName: 'EN123456/draft-dco/plan.pdf',
					isCertified: true,
					SubCategory: {
						connect: {
							id: 'draft-development-consent-order'
						}
					},
					ApfpRegulation: {
						connect: {
							id: '5-1'
						}
					},
					Case: {
						connect: {
							id: 'case-id-1'
						}
					}
				}
			});
		});
		it('should throw if error encountered during database operations', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({ reference: 'EN123456' }))
				},
				document: {
					create: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					})
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							apfpRegulation: '5-1',
							isCertified: 'yes',
							documentType: 'draft-development-consent-order',
							fileUpload: [
								{
									fileName: 'test.pdf',
									size: 208,
									formattedSize: '208B',
									blobName: `EN123456/draft-dco/test.pdf`
								},
								{
									fileName: 'plan.pdf',
									size: 500,
									formattedSize: '500B',
									blobName: `EN123456/draft-dco/plan.pdf`
								}
							]
						}
					}
				}
			};
			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				DOCUMENT_CATEGORY_ID.DRAFT_DCO
			);
			await assert.rejects(() => controller({}, mockRes), { message: 'error saving upload document journey' });
		});
		it('should throw if res.locals is not present', async () => {
			const controller = buildSaveController({}, DOCUMENT_CATEGORY_ID.DRAFT_DCO);
			await assert.rejects(() => controller({}, {}), { message: 'journey response required' });
		});
		it('should throw if res.locals.journeyResponse is not present', async () => {
			const controller = buildSaveController({}, DOCUMENT_CATEGORY_ID.DRAFT_DCO);
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
			const controller = buildSaveController({}, DOCUMENT_CATEGORY_ID.DRAFT_DCO);
			await assert.rejects(() => controller({}, mockRes), { message: 'answers should be an object' });
		});
	});
});
