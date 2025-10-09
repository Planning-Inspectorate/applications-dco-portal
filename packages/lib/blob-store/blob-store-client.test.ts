// @ts-nocheck

import { describe, it } from 'node:test';
import { mockLogger } from '../testing/mock-logger.ts';
import assert from 'node:assert';
import { BlobStorageClient } from './blob-store-client.ts';

describe(`gov-notify-client`, () => {
	describe('upload', () => {
		// it('should call upload document into blob store', async (ctx) => {
		// 	const logger = mockLogger();
		// 	const client = new BlobStorageClient(logger, 'https://test-host.com', 'dco-portal');
		//
		// 	const result = await client.upload(Buffer.from('test data', 'utf-8'), 'pdf', 'doc-category-1');
		// });
		it('should log an error if blob store upload fails', async (ctx) => {
			const logger = mockLogger();
			const client = new BlobStorageClient(logger, 'http://test-host.com', 'dco-portal');
			ctx.mock.method(client.blobServiceClient, 'getContainerClient', () => {
				const error = new Error('Could not find container');
				error.response = { data: { errors: ['Error 1', 'Error 2'] } };
				throw error;
			});
			await assert.rejects(
				async () => {
					await client.upload('templateId', 'pdf', 'doc-category-1');
				},
				{
					message: 'Could not find container'
				}
			);
			assert.strictEqual(logger.error.mock.callCount(), 1);
		});
	});
});
