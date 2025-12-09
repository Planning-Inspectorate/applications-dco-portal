// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildAboutTheProjectHomePage } from './controller.ts';

describe('about-the-project controller', () => {
	describe('buildAboutTheProjectHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT }
						]
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/consent-reason');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						hasAssociatedDevelopments: 'yes',
						associatedDevelopments: 'doc-id-1'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/consent-reason');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						hasAssociatedDevelopments: 'no'
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/consent-reason');

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
