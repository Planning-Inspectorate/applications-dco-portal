// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildDeleteDocumentAndSaveController,
	buildFileUploadHomePage,
	buildIsFileUploadSectionCompleted
} from './controller.ts';
import assert from 'node:assert';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

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
	describe('buildDeleteDocumentAndSaveController', () => {
		it('should delete document from blob store and update db to reflect', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					})),
					delete: mock.fn()
				}
			};
			const mockBlob = {
				deleteBlobIfExists: mock.fn()
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				status: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController({
				db: mockDb,
				blobStore: mockBlob,
				logger: mockLogger()
			});
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/draft-dco');

			assert.strictEqual(mockBlob.deleteBlobIfExists.mock.callCount(), 1);
			assert.deepStrictEqual(mockBlob.deleteBlobIfExists.mock.calls[0].arguments[0], '/case-id-1/draft-dco/test.pdf');

			assert.strictEqual(mockDb.document.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.document.delete.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.document.delete.mock.calls[0].arguments[0], {
				where: {
					id: 'doc-id-1'
				}
			});
		});
		it('should throw error if error encountered during blob store deletion', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					}))
				}
			};
			const mockBlob = {
				deleteBlobIfExists: mock.fn(() => {
					throw new Error('Error encountered during blob store deletion');
				})
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				status: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController({
				db: mockDb,
				blobStore: mockBlob,
				logger: mockLogger()
			});
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'Failed to delete file from blob store' });
		});
		it('should throw error if error encountered during db operation', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					})),
					delete: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					})
				}
			};
			const mockBlob = {
				deleteBlobIfExists: mock.fn()
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				status: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController({
				db: mockDb,
				blobStore: mockBlob,
				logger: mockLogger()
			});
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'Failed to delete file from database' });
		});
		it('should return not found handler if documentId param is not present', async (ctx) => {
			const mockReq = { params: {}, session: {} };
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};
			const controller = buildDeleteDocumentAndSaveController({});
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
		it('should return not found handler if doc does not exist in the db', async (ctx) => {
			const mockDb = {
				document: {
					findUnique: mock.fn()
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController({ db: mockDb });
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
});
