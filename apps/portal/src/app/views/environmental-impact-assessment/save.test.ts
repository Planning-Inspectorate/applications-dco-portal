// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('environmental-impact-assessment-information save', () => {
	describe('buildSaveController', () => {
		it('should save environmental impact assessment journey successfully if has environmental summary is yes', async () => {
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
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							nonTechnicalSummary: 'doc-id-3,doc-id-2',
							hasEnvironmentalStatement: 'yes',
							hasScreeningDirection: 'yes',
							screeningDirectionDocuments: 'doc-id-4',
							hasScopingOpinion: 'yes',
							scopingOpinionDocuments: 'doc-id-5',
							otherEnvironmentalDocuments:
								'introductory-chapters,aspect-chapters,environmental-statement-appendices,environmental-statement-figures,model-information,any-other-media-information,confidential-documents,sensitive-environmental-information',
							introductoryChapters: 'doc-id-15',
							aspectChapters: 'doc-id-6',
							environmentStatementAppendices: 'doc-id-7,doc-id-8',
							environmentStatementFigures: 'doc-id-9',
							modelInformation: 'doc-id-10',
							anyOtherMediaInformation: 'doc-id-11,doc-id-12',
							confidentialDocuments: 'doc-id-13',
							sensitiveInformation: 'doc-id-14',
							notifyingConsultationBodies: 'yes',
							notifyingOtherPeople: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 14);
		});
		it('should save environmental impact assessment journey successfully if has environmental summary is no', async () => {
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
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasEnvironmentalStatement: 'no',
							hasScreeningDirection: 'no',
							hasScopingOpinion: 'no',
							otherEnvironmentalDocuments: '',
							notifyingConsultationBodies: 'yes',
							notifyingOtherPeople: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 0);
		});
		it('should not save any optional document uploads if has environmental summary is no', async () => {
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
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							nonTechnicalSummary: 'doc-id-3,doc-id-2',
							hasEnvironmentalStatement: 'no',
							hasScreeningDirection: 'no',
							screeningDirectionDocuments: '',
							hasScopingOpinion: 'no',
							scopingOpinionDocuments: '',
							otherEnvironmentalDocuments:
								'introductory-chapters,aspect-chapters,environmental-statement-appendices,environmental-statement-figures,model-information,any-other-media-information,confidential-documents,sensitive-environmental-information',
							introductoryChapters: 'doc-id-15',
							aspectChapters: 'doc-id-6',
							environmentStatementAppendices: 'doc-id-7,doc-id-8',
							environmentStatementFigures: 'doc-id-9',
							modelInformation: 'doc-id-10',
							anyOtherMediaInformation: 'doc-id-11,doc-id-12',
							confidentialDocuments: 'doc-id-13',
							sensitiveInformation: 'doc-id-14',
							notifyingConsultationBodies: 'yes',
							notifyingOtherPeople: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 0);
		});
		it('should not save any optional document uploads if it was not selected previously', async () => {
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
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							nonTechnicalSummary: 'doc-id-3,doc-id-2',
							hasEnvironmentalStatement: 'yes',
							hasScreeningDirection: 'no',
							screeningDirectionDocuments: '',
							hasScopingOpinion: 'no',
							scopingOpinionDocuments: '',
							otherEnvironmentalDocuments: 'introductory-chapters',
							introductoryChapters: 'doc-id-15',
							aspectChapters: 'doc-id-6',
							environmentStatementAppendices: 'doc-id-7,doc-id-8',
							environmentStatementFigures: 'doc-id-9',
							modelInformation: 'doc-id-10',
							anyOtherMediaInformation: 'doc-id-11,doc-id-12',
							confidentialDocuments: 'doc-id-13',
							sensitiveInformation: 'doc-id-14',
							notifyingConsultationBodies: 'yes',
							notifyingOtherPeople: 'yes'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 3);
		});
		it('should redirect to not found page if the case data is not present in db', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
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
							hasEnvironmentalStatement: 'no',
							hasScreeningDirection: 'no',
							hasScopingOpinion: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
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
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							hasEnvironmentalStatement: 'no',
							hasScreeningDirection: 'no',
							hasScopingOpinion: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving environmental impact assessment journey'
			});
		});
	});
});
