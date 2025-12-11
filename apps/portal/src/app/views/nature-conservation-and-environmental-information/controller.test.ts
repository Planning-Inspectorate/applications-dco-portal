// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildNatureConservationAndEnvironmentalInformationHomePage } from './controller.ts';

describe('nature-conservation-and-environmental-information controller', () => {
	describe('buildNatureConservationAndEnvironmentalInformationHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for both options', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
							},
							{
								documentId: 'doc-id-2',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildNatureConservationAndEnvironmentalInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/nature-conservation-and-environmental-information/details/natural-environment-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'nature-conservation-and-environmental-information': {
						naturalEnvironmentInformation: 'doc-id-1',
						hasNaturalEnvironmentInformation: 'yes',
						historicEnvironmentInformation: 'doc-id-2',
						hasHistoricEnvironmentInformation: 'yes'
					}
				}
			});
		});
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for only natural information', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => {
						return args?.where?.subCategoryId ===
							DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
							? 1
							: 0;
					})
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildNatureConservationAndEnvironmentalInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/nature-conservation-and-environmental-information/details/natural-environment-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'nature-conservation-and-environmental-information': {
						naturalEnvironmentInformation: 'doc-id-1',
						hasNaturalEnvironmentInformation: 'yes',
						historicEnvironmentInformation: '',
						hasHistoricEnvironmentInformation: 'no'
					}
				}
			});
		});
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for only historic information', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.PLANS_SHOWING_HISTORIC_OR_SCHEDULED_MONUMENT_SITES
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => {
						return args?.where?.subCategoryId ===
							DOCUMENT_SUB_CATEGORY_ID.PLANS_OF_STATUTORY_AND_NON_STATUTORY_SITES_OR_FEATURES
							? 0
							: 1;
					})
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildNatureConservationAndEnvironmentalInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/nature-conservation-and-environmental-information/details/natural-environment-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'nature-conservation-and-environmental-information': {
						historicEnvironmentInformation: 'doc-id-1',
						hasHistoricEnvironmentInformation: 'yes',
						naturalEnvironmentInformation: '',
						hasNaturalEnvironmentInformation: 'no'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present either option', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => 0)
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildNatureConservationAndEnvironmentalInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/nature-conservation-and-environmental-information/details/natural-environment-information'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'nature-conservation-and-environmental-information': {
						hasNaturalEnvironmentInformation: 'no',
						naturalEnvironmentInformation: '',
						hasHistoricEnvironmentInformation: 'no',
						historicEnvironmentInformation: ''
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/nature-conservation-and-environmental-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildNatureConservationAndEnvironmentalInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/nature-conservation-and-environmental-information/details/natural-environment-information'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
