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
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
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
						hasNaturalEnvironmentInformation: 'yes'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
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

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'nature-conservation-and-environmental-information': {
						hasNaturalEnvironmentInformation: 'no'
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
