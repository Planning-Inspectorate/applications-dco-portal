// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('crown-land-access-and-rights-of-way-plans save', () => {
	describe('buildSaveController', () => {
		it('should save crown land access and rights of way journey successfully if has both crown land and means of access documents', async () => {
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							crownLand: 'doc-id-3,doc-id-2',
							hasCrownLand: 'yes',
							meansOfAccess: 'doc-id-4',
							hasMeansOfAccess: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 3);
		});
		it('should save crown land access and rights of way journey successfully if has only means of access document', async () => {
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasCrownLand: 'no',
							meansOfAccess: 'doc-id-4',
							hasMeansOfAccess: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 1);
		});
		it('should save crown land access and rights of way journey successfully if has only crown land document', async () => {
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasCrownLand: 'yes',
							crownLand: 'doc-id-1,doc-id-2',
							hasMeansOfAccess: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 2);
		});
		it('should save crown land access and rights of way journey successfully if has neither crown land nor means of access documents', async () => {
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasCrownLand: 'no',
							hasMeansOfAccess: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 0);
		});
		it('should remove and not replace any existing documents pre-populated if the user answers that there is no document', async () => {
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							crownLand: 'doc-id-3,doc-id-2',
							hasCrownLand: 'no',
							meansOfAccess: 'doc-id-4',
							hasMeansOfAccess: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
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
							hasCrownLand: 'no',
							hasMeansOfAccess: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
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
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							hasCrownLand: 'no',
							hasMeansOfAccess: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving crown land access and rights of way plans journey'
			});
		});
	});
});
