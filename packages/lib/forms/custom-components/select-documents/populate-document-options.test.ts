// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { populateDocumentOptions } from './populate-document-options.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('populateDocumentOptions', () => {
	it('should return document options if document exist in the database', async () => {
		const mockReq = {
			session: {
				caseReference: 'EN123456'
			}
		};
		const mockDb = {
			case: {
				findUnique: mock.fn(() => ({
					Documents: [
						{
							id: 'id-1',
							fileName: 'test-doc-1.pdf'
						},
						{
							id: 'id-2',
							fileName: 'test-doc-2.pdf'
						},
						{
							id: 'id-3',
							fileName: 'test-doc-3.pdf'
						},
						{
							id: 'id-4',
							fileName: 'test-doc-4.pdf'
						}
					]
				}))
			}
		};

		const documentOptions = await populateDocumentOptions(mockReq, mockDb, DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT);

		assert.deepStrictEqual(documentOptions, [
			{ value: 'id-1', text: 'test-doc-1.pdf' },
			{ value: 'id-2', text: 'test-doc-2.pdf' },
			{ value: 'id-3', text: 'test-doc-3.pdf' },
			{ value: 'id-4', text: 'test-doc-4.pdf' }
		]);
	});
	it('should return an empty list if no documents returned from the database', async () => {
		const mockReq = {
			session: {
				caseReference: 'EN123456'
			}
		};
		const mockDb = {
			case: {
				findUnique: mock.fn(() => ({
					Documents: []
				}))
			}
		};

		assert.deepStrictEqual(
			await populateDocumentOptions(mockReq, mockDb, DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT),
			[]
		);
	});
});
