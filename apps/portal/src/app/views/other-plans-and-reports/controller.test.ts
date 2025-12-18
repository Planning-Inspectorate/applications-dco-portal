// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import { buildOtherPlansAndReportsHomePage } from './controller.ts';

describe('other-plans-and-reports controller', () => {
	describe('buildOtherPlansAndReportsHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherPlansAndReportsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FLOOR_PLANS },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FLOOR_PLANS },
							{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ELEVATION_DRAWINGS },
							{ documentId: 'doc-id-4', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SITE_LAYOUT_PLANS },
							{ documentId: 'doc-id-5', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS },
							{ documentId: 'doc-id-6', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAINAGE_AND_SURFACE_WATER_MANAGEMENT },
							{ documentId: 'doc-id-7', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NATIONAL_SECURITY_ISSUES },
							{ documentId: 'doc-id-8', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FAST_TRACK_ADMISSION_DOCUMENT }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherPlansAndReportsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-plans-and-reports/details/plans-drawings-sections'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'other-plans-and-reports': {
						otherPlansDrawingsSections: 'doc-id-1,doc-id-2,doc-id-3,doc-id-4,doc-id-5,doc-id-6',
						otherInformation: 'doc-id-7,doc-id-8'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherPlansAndReportsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherPlansAndReportsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-plans-and-reports/details/plans-drawings-sections'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'other-plans-and-reports': {
						otherPlansDrawingsSections: '',
						otherInformation: ''
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherPlansAndReportsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-plans-and-reports',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherPlansAndReportsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-plans-and-reports/details/plans-drawings-sections'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
