// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildDeleteDocumentAndSaveController,
	buildDownloadDocumentController,
	buildFileUploadHomePage
} from './controller.ts';
import assert from 'node:assert';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { Readable, Writable } from 'stream';

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
								id: 'doc-id-1',
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
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/draft-dco/document/download/doc-id-1" target="_blank" rel="noreferrer">test.pdf</a>'
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
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/draft-dco/document/delete/doc-id-1">Remove</a>'
						}
					]
				],
				pageTitle: 'Draft DCO',
				showUploadButton: true,
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
				showUploadButton: true,
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
	describe('buildDeleteDocumentAndSaveController', () => {
		it('should delete document from blob store and update db to reflect', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					update: mock.fn()
				},
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					})),
					count: mock.fn(() => 0),
					delete: mock.fn()
				},
				supportingEvidence: {
					findUnique: mock.fn()
				}
			};
			const mockBlob = {
				deleteBlobIfExists: mock.fn()
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				},
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				status: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController(
				{
					db: mockDb,
					blobStore: mockBlob,
					logger: mockLogger()
				},
				'draft-dco'
			);
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
			assert.strictEqual(mockDb.document.count.mock.callCount(), 1);

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				data: {
					draftDcoStatusId: 'not-started'
				},
				where: {
					reference: 'EN123456'
				}
			});
		});
		it('should delete document from blob store and update db to reflect', async (ctx) => {
			const now = new Date('2025-01-30T00:00:07.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'case-ref-1',
						draftDcoStatusId: 'in-progress',
						Documents: [
							{
								id: 'doc-id-1',
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
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					}))
				},
				supportingEvidence: {
					findUnique: mock.fn(() => ({
						id: '431e803f-9e12-4140-8671-24f7be807c47',
						caseId: '18be8caa-9176-4d69-8f1a-d3659fed89e8',
						documentId: 'f4194748-f9a1-4ee3-a8aa-87172c42f480',
						subCategoryId: 'draft-dco'
					}))
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockBlob = {
				deleteBlobIfExists: mock.fn()
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				},
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildDeleteDocumentAndSaveController(
				{
					db: mockDb,
					blobStore: mockBlob,
					logger: mockLogger()
				},
				'draft-dco'
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/file-upload/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Draft DCO',
				documentCategory: 'draftDco',
				documents: [
					[
						{
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/draft-dco/document/download/doc-id-1" target="_blank" rel="noreferrer">test.pdf</a>'
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
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/draft-dco/document/delete/doc-id-1">Remove</a>'
						}
					]
				],
				showUploadButton: true,
				uploadButtonUrl: '/draft-dco/upload/document-type',
				backLinkUrl: '/',
				isCompletedValue: 'no',
				errors: {
					draftDcoDocumentTable: {
						msg: 'You cannot delete a document that is being used as supporting evidence in the application form'
					}
				},
				errorSummary: [
					{
						text: 'You cannot delete a document that is being used as supporting evidence in the application form',
						href: '#draftDcoDocumentTable'
					}
				]
			});
		});
		it('should throw error if error encountered during blob store deletion', async (ctx) => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				document: {
					findUnique: mock.fn(() => ({
						blobName: '/case-id-1/draft-dco/test.pdf'
					}))
				},
				supportingEvidence: {
					findUnique: mock.fn()
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
				},
				supportingEvidence: {
					findUnique: mock.fn()
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
	describe('buildDownloadDocumentController', () => {
		it('should download document from blob store', async (ctx) => {
			const mockStream = new Readable({
				read() {
					this.push('file data');
					this.push(null);
				}
			});
			const mockDownloadResponse = {
				contentType: 'text/plain',
				contentLength: 9,
				readableStreamBody: mockStream
			};
			const mockDb = {
				document: {
					findUnique: mock.fn(() => ({ blobName: 'test.txt' }))
				}
			};
			const mockBlob = {
				downloadBlob: mock.fn(() => mockDownloadResponse)
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'doc-id-1'
				}
			};
			const mockRes = Object.assign(
				new Writable({
					write(chunk, encoding, callback) {
						callback();
					}
				}),
				{
					render: mock.fn(),
					status: mock.fn(),
					setHeader: mock.fn(),
					destroy: mock.fn()
				}
			);

			const controller = buildDownloadDocumentController(
				{
					db: mockDb,
					blobStore: mockBlob,
					logger: mockLogger()
				},
				'draft-dco'
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.setHeader.mock.callCount(), 3);
			assert.deepStrictEqual(mockRes.setHeader.mock.calls[0].arguments, ['Content-Type', 'text/plain']);
			assert.deepStrictEqual(mockRes.setHeader.mock.calls[1].arguments, ['Content-Length', 9]);
			assert.deepStrictEqual(mockRes.setHeader.mock.calls[2].arguments, [
				'Content-Disposition',
				'inline; filename="test.txt"'
			]);
		});
		it('should throw error if issue encountered downloading document from blob store', async (ctx) => {
			const mockDb = {
				document: {
					findUnique: mock.fn(() => ({ blobName: 'test.txt' }))
				}
			};
			const mockBlob = {
				downloadBlob: mock.fn(() => {
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
				render: mock.fn(),
				status: mock.fn(),
				setHeader: mock.fn(),
				destroy: mock.fn()
			};

			const controller = buildDownloadDocumentController(
				{
					db: mockDb,
					blobStore: mockBlob,
					logger: mockLogger()
				},
				'draft-dco'
			);
			await assert.rejects(() => controller(mockReq, mockRes), { message: 'Failed to download file from blob store' });
		});
	});
});
