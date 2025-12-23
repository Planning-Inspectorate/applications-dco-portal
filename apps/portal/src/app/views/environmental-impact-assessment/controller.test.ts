// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildEnvironmentalImpactAssessmentHomePage } from './controller.ts';

describe('environmental-impact-assessment-information controller', () => {
	describe('buildEnvironmentalImpactAssessmentHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FLOOD_RISK_ASSESSMENT }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'environmental-impact-assessment-information': {
						environmentalImpactPlaceholder: 'doc-id-1',
						hasEnvironmentalImpactAssessment: 'yes'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'environmental-impact-assessment-information': {
						hasEnvironmentalStatement: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
