// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { deleteSubCategorySupportingEvidence, getSupportingEvidenceIds, saveSupportingEvidence } from './util.ts';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('supporting-evidence', () => {
	describe('saveSupportingEvidence', () => {
		it('should return answers if present in journeyResponse', async () => {
			const transaction = {
				supportingEvidence: {
					upsert: mock.fn()
				}
			};
			const caseId = 'case-id-1';
			const documentId = 'document-id-1';
			const subCategoryId = DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS;

			await saveSupportingEvidence(transaction, caseId, documentId, subCategoryId);

			assert.strictEqual(transaction.supportingEvidence.upsert.mock.callCount(), 1);
			assert.deepStrictEqual(transaction.supportingEvidence.upsert.mock.calls[0].arguments[0], {
				create: {
					Case: {
						connect: {
							id: 'case-id-1'
						}
					},
					Document: {
						connect: {
							id: 'document-id-1'
						}
					},
					SubCategory: {
						connect: {
							id: 'statement-of-reasons'
						}
					}
				},
				update: {},
				where: {
					caseId_documentId_subCategoryId: {
						caseId: 'case-id-1',
						documentId: 'document-id-1',
						subCategoryId: 'statement-of-reasons'
					}
				}
			});
		});
	});
	describe('deleteSubCategorySupportingEvidence', () => {
		it('should return answers if present in journeyResponse', async () => {
			const transaction = {
				supportingEvidence: {
					deleteMany: mock.fn()
				}
			};
			const caseId = 'case-id';

			await deleteSubCategorySupportingEvidence(transaction, caseId, [
				{
					key: 'statementOfReasons',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.STATEMENT_OF_REASONS
				},
				{
					key: 'fundingStatement',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.FUNDING_STATEMENT
				},
				{
					key: 'bookOfReference',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.BOOK_OF_REFERENCE_PARTS_1_TO_5
				},
				{
					key: 'landAndRightsNegotiationsTracker',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.LAND_AND_RIGHTS_NEGOTIATIONS_TRACKER
				}
			]);

			assert.strictEqual(transaction.supportingEvidence.deleteMany.mock.callCount(), 1);
			assert.deepStrictEqual(transaction.supportingEvidence.deleteMany.mock.calls[0].arguments[0], {
				where: {
					caseId,
					subCategoryId: {
						in: [
							'statement-of-reasons',
							'funding-statement',
							'book-of-reference',
							'land-and-rights-negotiations-tracker'
						]
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
