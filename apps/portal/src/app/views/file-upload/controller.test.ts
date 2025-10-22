// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { buildFileUploadHomePage, buildIsFileUploadSectionCompleted } from './controller.ts';
import assert from 'node:assert';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('file upload controllers', () => {
	describe('buildFileUploadHomePage', () => {
		it('should render file upload home page for given document type with documents', async (ctx) => {
			const now = new Date('2025-01-30T00:00:07.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'case-ref-1',
						draftDcoStatusId: 'in-progress',
						Documents: [
							{
								fileName: 'test.pdf',
								uploadedDate: Date.now(),
								isCertified: true,
								apfpRegulationId: '5-1',
								ApfpRegulation: {
									id: '5-1',
									displayName: '5(1)'
								},
								subCategoryId: 'draft-development-consent-order',
								SubCategory: {
									id: 'draft-development-consent-order',
									displayName: 'Draft development consent order',
									Category: {
										id: 'draft-dco',
										displayName: 'Draft DCO'
									}
								}
							}
						]
					}))
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				session: {
					caseReference: 'case-ref-1'
				}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildFileUploadHomePage({ db: mockDb }, 'draft-dco');
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/file-upload/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				documentCategory: 'draftDco',
				documents: [
					[
						{
							html: '<a class="govuk-link" href="#">test.pdf</a>'
						},
						{
							text: 'Draft development consent order'
						},
						{
							text: '5(1)'
						},
						{
							text: 'Certified'
						},
						{
							text: '30/01/2025 00:00'
						},
						{
							html: '<a class="govuk-link" href="#">Remove</a>'
						}
					]
				],
				pageTitle: 'Draft DCO',
				uploadButtonUrl: '/draft-dco/upload/document-type',
				isCompletedValue: 'no'
			});
		});
		it('should render file upload home page for given document type with no documents', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'case-ref-1',
						Documents: []
					}))
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				body: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildFileUploadHomePage({ db: mockDb }, 'draft-dco');
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/file-upload/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				documentCategory: 'draftDco',
				documents: [],
				pageTitle: 'Draft DCO',
				uploadButtonUrl: '/draft-dco/upload/document-type',
				isCompletedValue: ''
			});
		});
		it('should render not found handler if caseData not found in database', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn()
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				body: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildFileUploadHomePage({ db: mockDb }, 'draft-dco');
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
	});
	describe('buildIsFileUploadSectionCompleted', () => {
		it('should redirect to landing page if radio button selected', async () => {
			const mockDb = {
				case: {
					findFirst: mock.fn(),
					update: mock.fn()
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				session: {
					isAuthenticated: true,
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				},
				body: { draftDcoIsCompleted: 'yes' }
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildIsFileUploadSectionCompleted({ db: mockDb }, 'draft-dco');
			await controller(mockReq, mockRes);

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: { draftDcoStatusId: 'completed' }
			});

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');
		});
		it('should redirect to document page with errors if no radio button selected', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						Documents: []
					}))
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				body: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildIsFileUploadSectionCompleted({ db: mockDb }, 'draft-dco');
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/file-upload/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Draft DCO',
				documentCategory: 'draftDco',
				documents: [],
				uploadButtonUrl: '/draft-dco/upload/document-type',
				backLinkUrl: '/',
				isCompletedValue: '',
				errors: { draftDcoIsCompleted: { msg: 'You must select an answer' } },
				errorSummary: [{ text: 'You must select an answer', href: '#draftDcoIsCompleted' }]
			});
		});
	});
});
