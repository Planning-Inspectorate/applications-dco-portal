// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildInfrastructureSpecificAdditionalInfoHomePage } from './controller.ts';

describe('infrastructure-specific-additional-information controller', () => {
	describe('buildInfrastructureSpecificAdditionalInfoHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						infrastructureSpecificAdditionalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						infrastructureAdditionalInformationDescription: 'test desc',
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_OFFSHORE_GENERATING_STATION },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION },
							{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.OFFSHORE_GENERATING_STATION },
							{ documentId: 'doc-id-4', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HIGHWAY_RELATED_DEVELOPMENT },
							{ documentId: 'doc-id-5', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.RAILWAY_DEVELOPMENT },
							{ documentId: 'doc-id-6', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES },
							{ documentId: 'doc-id-7', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HARBOUR_FACILITIES },
							{ documentId: 'doc-id-8', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PIPELINES },
							{ documentId: 'doc-id-9', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY },
							{ documentId: 'doc-id-10', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HAZARDOUS_WASTE_FACILITY },
							{ documentId: 'doc-id-11', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR },
							{ documentId: 'doc-id-12', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DAM_OR_RESERVOIR }
						],
						NonOffshoreGeneratingStation: {
							electricityGrid: 'Test Grid',
							gasFuelledGeneratingStation: true,
							gasPipelineConnection: 'Test Pipeline'
						},
						OffshoreGeneratingStation: {
							cableInstallation: 'cables',
							safetyZones: 'safety'
						},
						HighwayRelatedDevelopment: {
							groundLevels: 'ground',
							bridgeHeights: 'bridges',
							tunnelDepths: 'tunnels',
							tidalWaterLevels: 'tide',
							heightOfStructures: 'height',
							drainageOutfallDetails: 'drainage'
						},
						RailwayDevelopment: {
							groundLevels: 'ground',
							bridgeHeights: 'bridges',
							tunnelDepths: 'tunnels',
							tidalWaterLevels: 'tide',
							heightOfStructures: 'height',
							drainageOutfallDetails: 'drainage'
						}
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildInfrastructureSpecificAdditionalInfoHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/infrastructure-specific-additional-information/details/additional-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'infrastructure-specific-additional-information': {
						hasAdditionalInformation: 'yes',
						additionalInformationDescription: 'test desc',
						additionalInformationDocuments:
							'offshore-generating-station,non-offshore-generating-station,highway-related-development,railway-development,harbour-facilities,pipelines,hazardous-waste-facility,dam-or-reservoir',
						electricityGrid: 'Test Grid',
						gasFuelledGeneratingStation: 'yes',
						gasPipelineConnection: 'Test Pipeline',
						nonOffshoreGeneratingStation: 'doc-id-1',
						cableInstallation: 'cables',
						safetyZones: 'safety',
						offshoreGeneratingStation: 'doc-id-2,doc-id-3',
						highwayGroundLevels: 'ground',
						highwayBridgeHeights: 'bridges',
						highwayTunnelDepths: 'tunnels',
						highwayTidalWaterLevels: 'tide',
						highwayHeightOfStructures: 'height',
						highwayDrainageOutfallDetails: 'drainage',
						highwayRelatedDevelopment: 'doc-id-4',
						railwayGroundLevels: 'ground',
						railwayBridgeHeights: 'bridges',
						railwayTunnelDepths: 'tunnels',
						railwayTidalWaterLevels: 'tide',
						railwayHeightOfStructures: 'height',
						railwayDrainageOutfallDetails: 'drainage',
						railwayDevelopment: 'doc-id-5',
						harbourFacilities: 'doc-id-6,doc-id-7',
						pipelines: 'doc-id-8',
						hazardousWasteFacility: 'doc-id-9,doc-id-10',
						damOrReservoir: 'doc-id-11,doc-id-12'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						infrastructureSpecificAdditionalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [],
						NonOffshoreGeneratingStation: null,
						OffshoreGeneratingStation: null,
						HighwayRelatedDevelopment: null,
						RailwayDevelopment: null
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 0)
				}
			};
			const mockReq = {
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildInfrastructureSpecificAdditionalInfoHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/infrastructure-specific-additional-information/details/additional-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'infrastructure-specific-additional-information': {
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
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						infrastructureSpecificAdditionalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 0)
				}
			};
			const mockReq = {
				baseUrl: '/infrastructure-specific-additional-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildInfrastructureSpecificAdditionalInfoHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/infrastructure-specific-additional-information/details/additional-information'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
