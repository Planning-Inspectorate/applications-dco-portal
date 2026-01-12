// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('infrastructure-specific-additional-information save', () => {
	describe('buildSaveController', () => {
		it('should save infrastructure specific additional information journey successfully if has environmental summary is yes', async () => {
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
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasAdditionalInformation: 'yes',
							additionalInformationDescription: 'test desc',
							additionalInformationDocuments:
								'offshore-generating-station,non-offshore-generating-station,highway-related-development,railway-development,harbour-facilities,pipelines,hazardous-waste-facility,dam-or-reservoir',
							electricityGrid: 'test',
							gasFuelledGeneratingStation: 'yes',
							gasPipelineConnection: 'test connection',
							nonOffshoreGeneratingStation: 'doc-id-1',
							cableInstallation: 'cable',
							safetyZones: 'safe',
							offshoreGeneratingStation: 'doc-id-2,doc-id-3',
							highwayGroundLevels: 'ground',
							highwayBridgeHeights: 'bridge',
							highwayTunnelDepths: 'tunnel',
							highwayTidalWaterLevels: 'water',
							highwayHeightOfStructures: 'struc',
							highwayDrainageOutfallDetails: 'drain',
							highwayRelatedDevelopment: 'doc-id-4',
							railwayGroundLevels: 'ground',
							railwayBridgeHeights: 'bridge',
							railwayTunnelDepths: 'tunnel',
							railwayTidalWaterLevels: 'water',
							railwayHeightOfStructures: 'struc',
							railwayDrainageOutfallDetails: 'drain',
							railwayDevelopment: 'doc-id-5',
							harbourFacilities: 'doc-id-6,doc-id-7',
							pipelines: 'doc-id-8',
							hazardousWasteFacility: 'doc-id-9,doc-id-10',
							damOrReservoir: 'doc-id-11,doc-id-12'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 12);
		});
		it('should save infrastructure specific additional information journey successfully if has environmental summary is no', async () => {
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
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasAdditionalInformation: 'no',
							additionalInformationDescription: '',
							additionalInformationDocuments: '',
							electricityGrid: '',
							gasFuelledGeneratingStation: 'no',
							gasPipelineConnection: '',
							nonOffshoreGeneratingStation: '',
							cableInstallation: '',
							safetyZones: '',
							offshoreGeneratingStation: '',
							highwayGroundLevels: '',
							highwayBridgeHeights: '',
							highwayTunnelDepths: '',
							highwayTidalWaterLevels: '',
							highwayHeightOfStructures: '',
							highwayDrainageOutfallDetails: '',
							highwayRelatedDevelopment: '',
							railwayGroundLevels: '',
							railwayBridgeHeights: '',
							railwayTunnelDepths: '',
							railwayTidalWaterLevels: '',
							railwayHeightOfStructures: '',
							railwayDrainageOutfallDetails: '',
							railwayDevelopment: '',
							harbourFacilities: '',
							pipelines: '',
							hazardousWasteFacility: '',
							damOrReservoir: ''
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);

			assert.strictEqual(mockDb.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.strictEqual(mockDb.supportingEvidence.upsert.mock.callCount(), 0);
		});
		it('should not save any optional document uploads if has additional information is no', async () => {
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
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasAdditionalInformation: 'no',
							additionalInformationDescription: 'test desc',
							additionalInformationDocuments:
								'offshore-generating-station,non-offshore-generating-station,highway-related-development,railway-development,harbour-facilities,pipelines,hazardous-waste-facility,dam-or-reservoir',
							electricityGrid: 'test',
							gasFuelledGeneratingStation: true,
							gasPipelineConnection: 'test connection',
							nonOffshoreGeneratingStation: 'doc-id-1',
							cableInstallation: 'cable',
							safetyZones: 'safe',
							offshoreGeneratingStation: 'doc-id-2,doc-id-3',
							highwayGroundLevels: 'ground',
							highwayBridgeHeights: 'bridge',
							highwayTunnelDepths: 'tunnel',
							highwayTidalWaterLevels: 'water',
							highwayHeightOfStructures: 'struc',
							highwayDrainageOutfallDetails: 'drain',
							highwayRelatedDevelopment: 'doc-id-4',
							railwayGroundLevels: 'ground',
							railwayBridgeHeights: 'bridge',
							railwayTunnelDepths: 'tunnel',
							railwayTidalWaterLevels: 'water',
							railwayHeightOfStructures: 'struc',
							railwayDrainageOutfallDetails: 'drain',
							railwayDevelopment: 'doc-id-5',
							harbourFacilities: 'doc-id-6,doc-id-7',
							pipelines: 'doc-id-8',
							hazardousWasteFacility: 'doc-id-9,doc-id-10',
							damOrReservoir: 'doc-id-11,doc-id-12'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
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
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							hasAdditionalInformation: 'yes',
							additionalInformationDescription: 'test desc',
							additionalInformationDocuments: 'offshore-generating-station',
							nonOffshoreGeneratingStation: 'doc-id-1',
							cableInstallation: 'cable',
							safetyZones: 'safe',
							offshoreGeneratingStation: 'doc-id-2,doc-id-3',
							highwayGroundLevels: 'ground',
							highwayBridgeHeights: 'bridge',
							highwayTunnelDepths: 'tunnel',
							highwayTidalWaterLevels: 'water',
							highwayHeightOfStructures: 'struc',
							highwayDrainageOutfallDetails: 'drain',
							highwayRelatedDevelopment: 'doc-id-4',
							railwayGroundLevels: 'ground',
							railwayBridgeHeights: 'bridge',
							railwayTunnelDepths: 'tunnel',
							railwayTidalWaterLevels: 'water',
							railwayHeightOfStructures: 'struc',
							railwayDrainageOutfallDetails: 'drain',
							railwayDevelopment: 'doc-id-5',
							harbourFacilities: 'doc-id-6,doc-id-7',
							pipelines: 'doc-id-8',
							hazardousWasteFacility: 'doc-id-9,doc-id-10',
							damOrReservoir: 'doc-id-11,doc-id-12'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
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
				baseUrl: '/infrastructure-specific-additional-information',
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
							hasAdditionalInformation: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
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
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							hasAdditionalInformation: 'no'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await assert.rejects(() => controller(mockReq, mockRes), {
				message: 'error saving infrastructure specific additional information journey'
			});
		});
	});
});
