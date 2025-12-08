// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import { PROJECT_SITE_TYPE_IDS } from './constants.ts';

describe('about the project journey save controller', () => {
	describe('buildSaveController', () => {
		it('should save project details into the database for single sites', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456'
					})),
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description',
							singleOrLinear: PROJECT_SITE_TYPE_IDS.SINGLE,
							easting: 123456,
							northing: 345678
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
			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatus: { connect: { id: 'completed' } },
					ProjectSingleSite: {
						upsert: {
							update: {
								easting: 123456,
								northing: 345678
							},
							create: {
								easting: 123456,
								northing: 345678
							}
						}
					}
				}
			});
		});
		it('should save project details into the database for linear sites', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456'
					})),
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description',
							singleOrLinear: PROJECT_SITE_TYPE_IDS.LINEAR,
							startEasting: 123456,
							startNorthing: 345678,
							middleEasting: 123456,
							middleNorthing: 345678,
							endEasting: 123456,
							endNorthing: 345678
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
			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatus: { connect: { id: 'completed' } },
					ProjectLinearSite: {
						upsert: {
							update: {
								startEasting: 123456,
								startNorthing: 345678,
								middleEasting: 123456,
								middleNorthing: 345678,
								endEasting: 123456,
								endNorthing: 345678
							},
							create: {
								startEasting: 123456,
								startNorthing: 345678,
								middleEasting: 123456,
								middleNorthing: 345678,
								endEasting: 123456,
								endNorthing: 345678
							}
						}
					}
				}
			});
		});
		it('should save project details into the database and delete existing single site records if saving a linear site', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ProjectSingleSite: {
							id: 'single-site-id'
						}
					})),
					update: mock.fn(() => 'document-id')
				},
				singleSite: {
					delete: mock.fn(() => {})
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description',
							singleOrLinear: PROJECT_SITE_TYPE_IDS.LINEAR,
							startEasting: 123456,
							startNorthing: 345678,
							middleEasting: 123456,
							middleNorthing: 345678,
							endEasting: 123456,
							endNorthing: 345678
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
			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.singleSite.delete.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.singleSite.delete.mock.calls[0].arguments[0], {
				where: { id: 'single-site-id' }
			});
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatus: { connect: { id: 'completed' } },
					ProjectLinearSite: {
						upsert: {
							update: {
								startEasting: 123456,
								startNorthing: 345678,
								middleEasting: 123456,
								middleNorthing: 345678,
								endEasting: 123456,
								endNorthing: 345678
							},
							create: {
								startEasting: 123456,
								startNorthing: 345678,
								middleEasting: 123456,
								middleNorthing: 345678,
								endEasting: 123456,
								endNorthing: 345678
							}
						}
					}
				}
			});
		});
		it('should save project details into the database and delete existing linear site records if saving a single site', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ProjectLinearSite: {
							id: 'linear-site-id'
						}
					})),
					update: mock.fn(() => 'document-id')
				},
				linearSite: {
					delete: mock.fn(() => {})
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description',
							singleOrLinear: PROJECT_SITE_TYPE_IDS.SINGLE,
							easting: 123456,
							northing: 345678
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
			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.linearSite.delete.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.linearSite.delete.mock.calls[0].arguments[0], {
				where: { id: 'linear-site-id' }
			});
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatus: { connect: { id: 'completed' } },
					ProjectSingleSite: {
						upsert: {
							update: {
								easting: 123456,
								northing: 345678
							},
							create: {
								easting: 123456,
								northing: 345678
							}
						}
					}
				}
			});
		});
		it('should update any project details into the database ', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						projectDescription: 'This is a test project description',
						projectConsentReason: 'This is a test consent reason',
						ProjectSingleSite: {
							id: 'single-site-id'
						}
					})),
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description',
							singleOrLinear: PROJECT_SITE_TYPE_IDS.SINGLE,
							easting: 123456,
							northing: 345678
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
			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					projectDescription: 'This is a test project description',
					projectConsentReason: 'This is a test consent reason',
					aboutTheProjectStatus: { connect: { id: 'completed' } },
					ProjectSingleSite: {
						upsert: {
							update: {
								easting: 123456,
								northing: 345678
							},
							create: {
								easting: 123456,
								northing: 345678
							}
						}
					}
				}
			});
		});
		it('should throw if error encountered during database operations', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					}),
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
							consentReason: 'This is a test consent reason',
							locationDescription: 'This is a test location description'
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
