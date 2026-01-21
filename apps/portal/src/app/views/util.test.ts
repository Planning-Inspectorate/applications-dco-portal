// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { getDocumentCategoryDisplayName, getApplicationSectionDisplayName, statusIdRadioButtonValue } from './util.ts';
import { buildFileUploadHomePage } from './file-upload/controller.ts';
import { buildApplicantAgentDetailsHomePage } from './applicant-agent-details/controller.ts';
import { DOCUMENT_CATEGORY_ID, DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from './constants.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('dynamic forms util', () => {
	describe('getDocumentCategoryDisplayName', () => {
		it('should return document category display name', () => {
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
	describe('getApplicationSectionDisplayName', () => {
		it('should return application section display name', () => {
			assert.strictEqual(
				getApplicationSectionDisplayName(APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS),
				'Applicant and agent details'
			);
			assert.strictEqual(
				getApplicationSectionDisplayName(APPLICATION_SECTION_ID.ABOUT_THE_PROJECT),
				'About the project'
			);
		});
	});
	describe('statusIdRadioButtonValue', () => {
		it('should convert status id to radio button value', () => {
			assert.strictEqual(statusIdRadioButtonValue(DOCUMENT_CATEGORY_STATUS_ID.COMPLETED), 'yes');
			assert.strictEqual(statusIdRadioButtonValue(DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS), 'no');
			assert.strictEqual(statusIdRadioButtonValue(DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED), '');
		});
	});
});
