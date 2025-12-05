// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import { buildDraftOrderAndExplanatoryMemorandumHomePage } from './controller.ts';

describe('draft-order-and-explanatory-memorandum controller', () => {
	describe('buildDraftOrderAndExplanatoryMemorandumHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						draftOrderAndExplanatoryMemorandumStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER },
							{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM },
							{ documentId: 'doc-id-4', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.EXPLANATORY_MEMORANDUM },
							{ documentId: 'doc-id-5', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER },
							{ documentId: 'doc-id-6', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL },
							{ documentId: 'doc-id-7', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-order-and-explanatory-memorandum',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildDraftOrderAndExplanatoryMemorandumHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/draft-order-and-explanatory-memorandum/details/draft-development-consent-order'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'draft-order-and-explanatory-memorandum': {
						draftDevelopmentConsentOrder: 'doc-id-1,doc-id-2,doc-id-5',
						siValidationReportSuccessEmail: 'doc-id-6,doc-id-7',
						explanatoryMemorandum: 'doc-id-3,doc-id-4'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						draftOrderAndExplanatoryMemorandumStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-order-and-explanatory-memorandum',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildDraftOrderAndExplanatoryMemorandumHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/draft-order-and-explanatory-memorandum/details/draft-development-consent-order'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'draft-order-and-explanatory-memorandum': {
						draftDevelopmentConsentOrder: '',
						siValidationReportSuccessEmail: '',
						explanatoryMemorandum: ''
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						draftOrderAndExplanatoryMemorandumStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-order-and-explanatory-memorandum',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildDraftOrderAndExplanatoryMemorandumHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/draft-order-and-explanatory-memorandum/details/draft-development-consent-order'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
