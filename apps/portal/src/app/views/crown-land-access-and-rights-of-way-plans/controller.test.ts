// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildCrownLandAccessAndRightsOfWayPlansHomePage } from './controller.ts';

describe('crown-land-access-and-rights-of-way-plans controller', () => {
	describe('buildCrownLandAccessAndRightsOfWayPlansHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for both options', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN
							},
							{
								documentId: 'doc-id-2',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildCrownLandAccessAndRightsOfWayPlansHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/crown-land-access-and-rights-of-way-plans/details/has-crown-land'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'crown-land-access-and-rights-of-way-plans': {
						crownLand: 'doc-id-1',
						hasCrownLand: 'yes',
						hasMeansOfAccess: 'yes',
						meansOfAccess: 'doc-id-2'
					}
				}
			});
		});
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for only crown land', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => {
						return args?.where?.subCategoryId === DOCUMENT_SUB_CATEGORY_ID.CROWN_LAND_PLAN ? 1 : 0;
					})
				}
			};
			const mockReq = {
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildCrownLandAccessAndRightsOfWayPlansHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/crown-land-access-and-rights-of-way-plans/details/has-crown-land'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'crown-land-access-and-rights-of-way-plans': {
						crownLand: 'doc-id-1',
						hasCrownLand: 'yes',
						meansOfAccess: '',
						hasMeansOfAccess: 'no'
					}
				}
			});
		});
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present for only means of access', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN
							}
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => {
						return args?.where?.subCategoryId === DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN ? 1 : 0;
					})
				}
			};
			const mockReq = {
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildCrownLandAccessAndRightsOfWayPlansHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/crown-land-access-and-rights-of-way-plans/details/has-crown-land'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'crown-land-access-and-rights-of-way-plans': {
						meansOfAccess: 'doc-id-1',
						hasMeansOfAccess: 'yes',
						crownLand: '',
						hasCrownLand: 'no'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present either option', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				},
				supportingEvidence: {
					count: mock.fn((args) => 0)
				}
			};
			const mockReq = {
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildCrownLandAccessAndRightsOfWayPlansHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/crown-land-access-and-rights-of-way-plans/details/has-crown-land'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'crown-land-access-and-rights-of-way-plans': {
						crownLand: '',
						hasCrownLand: 'no',
						meansOfAccess: '',
						hasMeansOfAccess: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/crown-land-access-and-rights-of-way-plans',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildCrownLandAccessAndRightsOfWayPlansHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/crown-land-access-and-rights-of-way-plans/details/has-crown-land'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
