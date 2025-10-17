import { describe, it } from 'node:test';
import assert from 'node:assert';
import { kebabCaseToCamelCase } from './questions.ts';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('questions util', () => {
	describe('kebabCaseToCamelCase', () => {
		it('should convert kebab-case string to camelCase', () => {
			assert.strictEqual(
				kebabCaseToCamelCase(DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION),
				'applicationFormRelatedInformation'
			);
			assert.strictEqual(kebabCaseToCamelCase(DOCUMENT_CATEGORY_ID.DRAFT_DCO), 'draftDco');
			assert.strictEqual(
				kebabCaseToCamelCase(DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION),
				'additionalPrescribedInformation'
			);
			assert.strictEqual(kebabCaseToCamelCase(DOCUMENT_CATEGORY_ID.OTHER), 'otherDocuments');
		});
	});
});
