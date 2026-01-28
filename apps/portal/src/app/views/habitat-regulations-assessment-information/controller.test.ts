// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { buildHabitatRegulationsAssessmentInformationHomePage } from './controller.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('habitat-regulations-assessment-information controller', () => {
	describe('buildHabitatRegulationsAssessmentInformationHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						habitatRegulationsAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
							},
							{
								documentId: 'doc-id-2',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.HABITAT_REGULATIONS_ASSESSMENT_SCREENING_REPORT
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/habitat-regulations-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildHabitatRegulationsAssessmentInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.HABITAT_REGULATIONS_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/habitat-regulations-assessment-information/details/hra-report'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'habitat-regulations-assessment-information': {
						hasHabitatRegulationsAssessmentReport: 'yes',
						habitatRegulationsAssessmentScreeningReport: 'doc-id-1,doc-id-2'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						habitatRegulationsAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/habitat-regulations-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildHabitatRegulationsAssessmentInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.HABITAT_REGULATIONS_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/habitat-regulations-assessment-information/details/hra-report'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'habitat-regulations-assessment-information': {
						hasHabitatRegulationsAssessmentReport: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						habitatRegulationsAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/habitat-regulations-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildHabitatRegulationsAssessmentInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.HABITAT_REGULATIONS_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/habitat-regulations-assessment-information/details/hra-report'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
