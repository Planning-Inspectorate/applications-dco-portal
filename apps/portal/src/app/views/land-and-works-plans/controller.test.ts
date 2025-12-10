// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import { buildLandAndWorksPlansHomePage } from './controller.ts';

describe('land-and-works-plans controller', () => {
	describe('buildLandAndWorksPlansHomePage', () => {
		it('should return answers if present and prepopulate document selection supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						landAndWorksPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.LAND_PLANS },
							{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.WORKS_PLAN }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/land-and-works-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildLandAndWorksPlansHomePage({ db: mockDb }, APPLICATION_SECTION_ID.LAND_AND_WORKS_PLANS);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/land-and-works-plans/details/land-plans');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'land-and-works-plans': {
						landPlans: 'doc-id-1,doc-id-2',
						worksPlans: 'doc-id-3'
					}
				}
			});
		});
		it('should populate no document selection if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						landAndWorksPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/land-and-works-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildLandAndWorksPlansHomePage({ db: mockDb }, APPLICATION_SECTION_ID.LAND_AND_WORKS_PLANS);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/land-and-works-plans/details/land-plans');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'land-and-works-plans': {
						landPlans: '',
						worksPlans: ''
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						landAndWorksPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/land-and-works-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildLandAndWorksPlansHomePage({ db: mockDb }, APPLICATION_SECTION_ID.LAND_AND_WORKS_PLANS);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/land-and-works-plans/details/land-plans');

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
