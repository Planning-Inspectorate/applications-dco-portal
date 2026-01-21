// @ts-nocheck

import { describe, it, mock } from 'node:test';
import { findSupportingEvidenceByCategory, findSupportingEvidenceBySubcategory } from './dco-application-mapper.ts';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { DOCUMENT_SUB_CATEGORY_ID, DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('dco-application-mapper.ts', () => {
	describe('findSupportingEvidenceByCategory', () => {
		it('should filter an array of supporting evidence to contain those matching the category', () => {
			const supportingEvidence = [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				},
				{
					id: 'evidence-2',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
				},
				{
					id: 'evidence-3',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
				},
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				},
				{
					id: 'evidence-8',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			];
			const supportingEvidenceByCategory = findSupportingEvidenceByCategory(
				supportingEvidence,
				DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS
			);

			assert.deepStrictEqual(supportingEvidenceByCategory, [
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				}
			]);
		});
		it('if no supporting evidence matches the provided category return an empty array', () => {
			const supportingEvidence = [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				},
				{
					id: 'evidence-2',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
				},
				{
					id: 'evidence-3',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
				},
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				},
				{
					id: 'evidence-8',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			];
			const supportingEvidenceByCategory = findSupportingEvidenceByCategory(supportingEvidence, 'random-category');

			assert.deepStrictEqual(supportingEvidenceByCategory, []);
		});
		it('if supporting evidence is null then return empty array', () => {
			const supportingEvidenceByCategory = findSupportingEvidenceByCategory(
				null,
				DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION
			);

			assert.deepStrictEqual(supportingEvidenceByCategory, []);
		});
	});
	describe('findSupportingEvidenceBySubcategory', () => {
		it('should filter an array of supporting evidence to contain those matching the subcategory', () => {
			const supportingEvidence = [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				},
				{
					id: 'evidence-2',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
				},
				{
					id: 'evidence-3',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
				},
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				},
				{
					id: 'evidence-8',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			];
			const marineSchemesEvidence = findSupportingEvidenceBySubcategory(supportingEvidence, [
				DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
			]);
			const reportAppendicesEvidence = findSupportingEvidenceBySubcategory(supportingEvidence, [
				DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
			]);

			assert.deepStrictEqual(marineSchemesEvidence, [
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				}
			]);
			assert.deepStrictEqual(reportAppendicesEvidence, [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				}
			]);
		});
		it('should support filter evidence by multiple subcategories', () => {
			const supportingEvidence = [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				},
				{
					id: 'evidence-2',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
				},
				{
					id: 'evidence-3',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
				},
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				},
				{
					id: 'evidence-8',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			];
			const evidence = findSupportingEvidenceBySubcategory(supportingEvidence, [
				DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES,
				DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
			]);

			assert.deepStrictEqual(evidence, [
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			]);
		});
		it('if no supporting evidence matches the provided subcategory return an empty array', () => {
			const supportingEvidence = [
				{
					id: 'evidence-1',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT_APPENDICES
				},
				{
					id: 'evidence-2',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONSULTATION_REPORT
				},
				{
					id: 'evidence-3',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION
				},
				{
					id: 'evidence-4',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CAR_PARKING_LANDSCAPING_ACCESS
				},
				{
					id: 'evidence-5',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-6',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CHARTS_FOR_MARINE_SCHEMES
				},
				{
					id: 'evidence-7',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.TREE_PRESERVATION_ORDER_AND_HEDGEROW_PLAN
				},
				{
					id: 'evidence-8',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SI_VALIDATION_REPORT_SUCCESS_EMAIL
				},
				{
					id: 'evidence-9',
					subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DRAFT_DEVELOPMENT_CONSENT_ORDER
				}
			];
			const supportingEvidenceByCategory = findSupportingEvidenceBySubcategory(
				supportingEvidence,
				'random-subcategory'
			);

			assert.deepStrictEqual(supportingEvidenceByCategory, []);
		});
		it('if supporting evidence is null then return empty array', () => {
			const supportingEvidenceByCategory = findSupportingEvidenceBySubcategory(null, [
				DOCUMENT_SUB_CATEGORY_ID.APPLICATION_COVER_LETTER
			]);

			assert.deepStrictEqual(supportingEvidenceByCategory, []);
		});
	});
});
