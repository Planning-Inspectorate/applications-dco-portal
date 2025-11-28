// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { getSupportingEvidenceIds, mapAnswersToInput } from './util.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('supporting-evidence util', () => {
	describe('mapAnswersToInput', () => {
		it('should return answers mapped to input', async () => {
			assert.deepStrictEqual(mapAnswersToInput('case-id-1', 'doc-id-1', DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT), {
				Case: {
					connect: {
						id: 'case-id-1'
					}
				},
				Document: {
					connect: {
						id: 'doc-id-1'
					}
				},
				SubCategory: {
					connect: {
						id: 'funding-statement'
					}
				}
			});
		});
	});
	describe('getSupportingEvidenceIds', () => {
		it('should return a string of all the ids for the particular sub category id', async () => {
			const supportingEvidence = [
				{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT },
				{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS },
				{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.APPLICATION_COVER_LETTER },
				{ documentId: 'doc-id-4', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT },
				{ documentId: 'doc-id-5', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ACCESS_PLAN_AND_RIGHTS_OF_WAY_PLAN }
			];

			assert.deepStrictEqual(
				getSupportingEvidenceIds(supportingEvidence, DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT),
				'doc-id-1,doc-id-4'
			);
		});
		it('should return an empty string if supportingEvidence is empty', async () => {
			assert.deepStrictEqual(getSupportingEvidenceIds([], DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT), '');
		});
	});
});
