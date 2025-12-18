// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import { buildOtherConsentsOrLicencesDetailsHomePage } from './controller.ts';

describe('other-consents-or-licences-details controller', () => {
	describe('buildOtherConsentsOrLicencesDetailsHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherConsentsOrLicencesDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{
								documentId: 'doc-id-1',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
							},
							{
								documentId: 'doc-id-2',
								subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSENTS_AND_LICENCES_REQUIRED_UNDER_OTHER_LEGISLATION
							}
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-consents-or-licences-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherConsentsOrLicencesDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_CONSENTS_OR_LICENCES_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-consents-or-licences-details/details/has-other-consents'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'other-consents-or-licences-details': {
						hasOtherConsents: 'yes',
						otherConsentsDocuments: 'doc-id-1,doc-id-2'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherConsentsOrLicencesDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-consents-or-licences-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherConsentsOrLicencesDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_CONSENTS_OR_LICENCES_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-consents-or-licences-details/details/has-other-consents'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'other-consents-or-licences-details': {
						hasOtherConsents: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						otherConsentsOrLicencesDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/other-consents-or-licences-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildOtherConsentsOrLicencesDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.OTHER_CONSENTS_OR_LICENCES_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/other-consents-or-licences-details/details/has-other-consents'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
