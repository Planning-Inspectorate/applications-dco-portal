import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getDocumentCategoryDisplayName } from './util.ts';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('file-upload util', () => {
	describe('getDocumentCategoryDisplayName', () => {
		it('should error if used with the wrong router structure', () => {
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION),
				'Application form related information'
			);
			assert.strictEqual(getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS), 'Plans and drawings');
			assert.strictEqual(getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.DRAFT_DCO), 'Draft DCO');
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION),
				'Compulsory acquisition information'
			);
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT),
				'Consultation report'
			);
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS),
				'Reports and statements'
			);
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT),
				'Environmental statement'
			);
			assert.strictEqual(
				getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION),
				'Additional prescribed information'
			);
			assert.strictEqual(getDocumentCategoryDisplayName(DOCUMENT_CATEGORY_ID.OTHER), 'Other documents');
		});
	});
});
