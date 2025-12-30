// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildEnvironmentalImpactAssessmentHomePage } from './controller.ts';

describe('environmental-impact-assessment-information controller', () => {
	describe('buildEnvironmentalImpactAssessmentHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.NON_TECHNICAL_SUMMARY },
							{ documentId: 'doc-id-2', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION },
							{ documentId: 'doc-id-3', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCREENING_DIRECTION },
							{ documentId: 'doc-id-4', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SCOPING_OPINION },
							{ documentId: 'doc-id-5', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ASPECT_CHAPTERS },
							{ documentId: 'doc-id-6', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES },
							{ documentId: 'doc-id-7', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_APPENDICES },
							{ documentId: 'doc-id-8', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ENVIRONMENTAL_STATEMENT_FIGURES },
							{ documentId: 'doc-id-9', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.MODEL_INFORMATION },
							{ documentId: 'doc-id-10', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION },
							{ documentId: 'doc-id-11', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.ANY_OTHER_MEDIA_INFORMATION },
							{ documentId: 'doc-id-12', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.CONFIDENTIAL_DOCUMENTS },
							{ documentId: 'doc-id-13', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.SENSITIVE_ENVIRONMENTAL_INFORMATION },
							{ documentId: 'doc-id-14', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.INTRODUCTORY_CHAPTERS }
						]
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 1)
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'environmental-impact-assessment-information': {
						nonTechnicalSummary: 'doc-id-1',
						hasEnvironmentalStatement: 'yes',
						hasScreeningDirection: 'yes',
						screeningDirectionDocuments: 'doc-id-2,doc-id-3',
						hasScopingOpinion: 'yes',
						scopingOpinionDocuments: 'doc-id-4',
						otherEnvironmentalDocuments:
							'introductory-chapters,aspect-chapters,environmental-statement-appendices,environmental-statement-figures,model-information,any-other-media-information,confidential-documents,sensitive-environmental-information',
						introductoryChapters: 'doc-id-14',
						aspectChapters: 'doc-id-5',
						environmentStatementAppendices: 'doc-id-6,doc-id-7',
						environmentStatementFigures: 'doc-id-8',
						modelInformation: 'doc-id-9',
						anyOtherMediaInformation: 'doc-id-10,doc-id-11',
						confidentialDocuments: 'doc-id-12',
						sensitiveInformation: 'doc-id-13'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: []
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 0)
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'environmental-impact-assessment-information': {
						hasEnvironmentalStatement: 'no',
						hasScreeningDirection: 'no',
						hasScopingOpinion: 'no',
						nonTechnicalSummary: '',
						scopingOpinionDocuments: '',
						screeningDirectionDocuments: '',
						otherEnvironmentalDocuments: '',
						introductoryChapters: '',
						aspectChapters: '',
						environmentStatementAppendices: '',
						environmentStatementFigures: '',
						modelInformation: '',
						anyOtherMediaInformation: '',
						confidentialDocuments: '',
						sensitiveInformation: ''
					}
				}
			});
		});
		it('should skip populateForm if status is not-started', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				},
				supportingEvidence: {
					count: mock.fn(() => 0)
				}
			};
			const mockReq = {
				baseUrl: '/environmental-impact-assessment-information',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildEnvironmentalImpactAssessmentHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/environmental-impact-assessment-information/details/has-environmental-statement'
			);

			assert.deepStrictEqual(mockReq.session, { caseReference: 'EN123456' });
		});
	});
});
