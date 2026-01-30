// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { deleteDocumentsController, uploadDocumentsController } from './upload-documents.ts';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from './constants.ts';
import { DOCUMENT_CATEGORY_ID, DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

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
				session: {
					caseReference: 'EN123456'
				},
				body: {}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						answers: {
							documentType: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS
						}
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
							blobName: 'EN123456/draft-dco/confidential-documents/test4.pdf',
							blobNameBase64Encoded: 'RU4xMjM0NTYvZHJhZnQtZGNvL2NvbmZpZGVudGlhbC1kb2N1bWVudHMvdGVzdDQucGRm',
							fileName: 'test4.pdf',
							formattedSize: '222KB',
							size: 227787,
							mimeType: 'application/pdf'
						}
					]
				}
			});
		});
		it('should return errors if the total size of docs uploaded exceeds 1GB', async () => {
			const fakePdfContent = '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<<>>\n%%EOF';
			const file = {
				originalname: 'test4.pdf',
				mimetype: 'application/pdf',
				buffer: Buffer.from(fakePdfContent, 'utf-8'),
				size: 213647723
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				files: [file],
				session: {
					caseReference: 'EN123456',
					files: {
						'draft-dco': {
							uploadedFiles: [
								{ originalname: 'test1.pdf', size: 173647723 },
								{ originalname: 'test2.pdf', size: 173647723 },
								{ originalname: 'test3.pdf', size: 173647723 },
								{ originalname: 'test4.pdf', size: 173647723 },
								{ originalname: 'test6.pdf', size: 173647723 }
							]
						}
					}
				},
				body: {}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						answers: {
							documentType: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS
						}
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
			assert.deepStrictEqual(mockReq.session.errors, {
				'upload-form': {
					msg: 'Errors encountered during file upload'
				}
			});
			assert.deepStrictEqual(mockReq.session.errorSummary, [
				{
					text: 'Total file size of all attachments must not exceed 1GB',
					href: '#upload-form'
				}
			]);
			assert.strictEqual(mockBlobStore.uploadStream.mock.callCount(), 0);
		});
		it('should return errors if the number of files uploaded exceeds the max number of files allowed', async () => {
			const fakePdfContent = '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<<>>\n%%EOF';
			const file = {
				originalname: 'test4.pdf',
				mimetype: 'application/pdf',
				buffer: Buffer.from(fakePdfContent, 'utf-8'),
				size: 350
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				files: [file, file, file, file],
				session: {
					caseReference: 'EN123456',
					files: {
						'draft-dco': {
							uploadedFiles: [{ originalname: 'test1.pdf', size: 173647723 }]
						}
					}
				},
				body: {}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						answers: {
							documentType: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS
						}
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
			assert.deepStrictEqual(mockReq.session.errors, {
				'upload-form': {
					msg: 'Errors encountered during file upload'
				}
			});
			assert.deepStrictEqual(mockReq.session.errorSummary, [
				{
					text: 'You can only upload up to 3 files at a time',
					href: '#upload-form'
				}
			]);
			assert.strictEqual(mockBlobStore.uploadStream.mock.callCount(), 0);
		});
		it('should return errors if the file being uploaded already exists in blob store', async () => {
			const fakePdfContent = '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<<>>\n%%EOF';
			const file = {
				originalname: 'test4.pdf',
				mimetype: 'application/pdf',
				buffer: Buffer.from(fakePdfContent, 'utf-8'),
				size: 350
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				files: [file],
				session: {
					caseReference: 'EN123456',
					files: {
						'draft-dco': {
							uploadedFiles: [{ originalname: 'test1.pdf', size: 173647723 }]
						}
					}
				},
				body: {}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						journeyId: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						answers: {
							documentType: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS
						}
					}
				},
				redirect: mock.fn()
			};

			const mockBlobStore = {
				doesBlobExist: mock.fn(() => true),
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
			assert.deepStrictEqual(mockReq.session.errors, {
				'upload-form': {
					msg: 'Errors encountered during file upload'
				}
			});
			assert.deepStrictEqual(mockReq.session.errorSummary, [
				{
					text: 'Attachment with this name has already been uploaded',
					href: '#upload-form'
				}
			]);
			assert.strictEqual(mockBlobStore.uploadStream.mock.callCount(), 0);
		});
	});
	describe('deleteDocumentsController', () => {
		it('should successfully delete document', async () => {
			const mockReq = {
				baseUrl: '/draft-dco',
				params: {
					documentId: 'RU4xMjM0NTYvZHJhZnQtZGNvL3Rlc3Q0LnBkZg'
				},
				session: {
					files: {
						'draft-dco': {
							uploadedFiles: [
								{
									fileName: 'test4.pdf',
									size: 208,
									formattedSize: '208B',
									blobName: 'EN123456/draft-dco/test4.pdf'
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
