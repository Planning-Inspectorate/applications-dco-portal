// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildStatutoryNuisanceInformationHomePage } from './controller.ts';

describe('statutory-nuisance-information controller', () => {
	describe('buildStatutoryNuisanceInformationHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						statutoryNuisanceInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.STATUTORY_NUISANCE_STATEMENT }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/statutory-nuisance-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildStatutoryNuisanceInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.STATUTORY_NUISANCE_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/statutory-nuisance-information/details/has-statutory-nuisance-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'statutory-nuisance-information': {
						statutoryNuisanceStatement: 'doc-id-1,doc-id-2',
						hasStatutoryNuisanceStatement: 'yes'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						statutoryNuisanceInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/statutory-nuisance-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildStatutoryNuisanceInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.STATUTORY_NUISANCE_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/statutory-nuisance-information/details/has-statutory-nuisance-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'statutory-nuisance-information': {
						hasStatutoryNuisanceStatement: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						statutoryNuisanceInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/statutory-nuisance-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildStatutoryNuisanceInformationHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.STATUTORY_NUISANCE_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/statutory-nuisance-information/details/has-statutory-nuisance-statement'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
