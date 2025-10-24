// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { deleteDocumentsController, uploadDocumentsController } from './upload-documents.ts';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from './constants.ts';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('upload-documents.js', () => {
	describe('uploadDocumentsController', () => {
		it('should successfully upload document', async () => {
			const fakePdfContent = '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<<>>\n%%EOF';
			const file = {
				originalname: 'test4.pdf',
				mimetype: 'application/pdf',
				buffer: Buffer.from(fakePdfContent, 'utf-8'),
				size: 227787
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				files: [file],
				session: {},
				body: {}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO
					}
				},
				redirect: mock.fn()
			};

			const mockBlobStore = {
				doesBlobExist: mock.fn(() => false),
				uploadStream: mock.fn()
			};

			const mockLogger = {
				info: mock.fn(),
				error: mock.fn()
			};

			const controller = uploadDocumentsController(
				{ blobStore: mockBlobStore, logger: mockLogger },
				DOCUMENT_CATEGORY_ID.DRAFT_DCO,
				ALLOWED_EXTENSIONS,
				ALLOWED_MIME_TYPES,
				MAX_FILE_SIZE
			);

			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/draft-dco/upload/upload-documents');

			assert.strictEqual(mockBlobStore.doesBlobExist.mock.callCount(), 1);
			assert.strictEqual(mockBlobStore.uploadStream.mock.callCount(), 1);

			assert.deepStrictEqual(mockReq.session.files, {
				'draft-dco': {
					uploadedFiles: [
						{
							blobName: 'undefined/draft-dco/test4.pdf',
							fileName: 'test4.pdf',
							formattedSize: '222KB',
							size: 227787
						}
					]
				}
			});
		});
	});
	describe('deleteDocumentsController', () => {
		it('should successfully delete document', async () => {
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: encodeURI('EN123456/draft-dco/test.pdf')
				},
				session: {
					files: {
						'draft-dco': {
							uploadedFiles: [
								{
									fileName: 'test.pdf',
									size: 208,
									formattedSize: '208B',
									blobName: 'EN123456/draft-dco/test.pdf'
								}
							]
						}
					}
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO
					}
				},
				redirect: mock.fn()
			};

			const mockBlobStore = {
				deleteBlobIfExists: mock.fn()
			};

			const mockLogger = {
				info: mock.fn(),
				error: mock.fn()
			};

			const controller = deleteDocumentsController(
				{ blobStore: mockBlobStore, logger: mockLogger },
				DOCUMENT_CATEGORY_ID.DRAFT_DCO
			);

			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/draft-dco/upload/upload-documents');

			assert.strictEqual(mockBlobStore.deleteBlobIfExists.mock.callCount(), 1);

			assert.deepStrictEqual(mockReq.session.files, {
				'draft-dco': {
					uploadedFiles: []
				}
			});
		});
	});
});
