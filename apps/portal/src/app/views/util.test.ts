// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
	getDocumentCategoryDisplayName,
	getApplicationSectionDisplayName,
	statusIdRadioButtonValue,
	buildIsTaskCompleted,
	getAnswersFromRes
} from './util.ts';
import { buildFileUploadHomePage } from './file-upload/controller.ts';
import { buildApplicantAgentDetailsHomePage } from './applicant-agent-details/controller.ts';
import { DOCUMENT_CATEGORY_ID, DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from './constants.ts';

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
	describe('buildIsTaskCompleted', () => {
		it('should redirect to landing page if radio button selected', async () => {
			const mockDb = {
				case: {
					findFirst: mock.fn(),
					update: mock.fn()
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				session: {
					isAuthenticated: true,
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				},
				body: { draftDcoIsCompleted: 'yes' }
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildIsTaskCompleted({ db: mockDb }, 'draft-dco', buildFileUploadHomePage);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: { draftDcoStatusId: 'completed' }
			});

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');
		});
		it('should redirect to landing page if radio button selected for other tasks', async () => {
			const mockDb = {
				case: {
					findFirst: mock.fn(),
					update: mock.fn()
				},
				applicationSection: {
					findUnique: mock.fn(() => ({
						id: APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS,
						displayName: 'Applicant and agent details'
					}))
				}
			};
			const mockReq = {
				session: {
					isAuthenticated: true,
					emailAddress: 'test@email.com',
					caseReference: 'EN123456'
				},
				body: { applicantAndAgentDetailsIsCompleted: 'yes' }
			};
			const mockRes = { redirect: mock.fn() };

			const controller = buildIsTaskCompleted(
				{ db: mockDb },
				'applicant-and-agent-details',
				buildApplicantAgentDetailsHomePage
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: { applicantAndAgentDetailsStatusId: 'completed' }
			});

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/');
		});
		it('should redirect to document page with errors if no radio button selected', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						Documents: []
					}))
				},
				documentCategory: {
					findUnique: mock.fn(() => ({
						id: DOCUMENT_CATEGORY_ID.DRAFT_DCO,
						displayName: 'Draft DCO'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/draft-dco',
				body: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildIsTaskCompleted({ db: mockDb }, 'draft-dco', buildFileUploadHomePage);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/file-upload/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Draft DCO',
				documentCategory: 'draftDco',
				documents: [],
				showUploadButton: true,
				uploadButtonUrl: '/draft-dco/upload/document-type',
				backLinkUrl: '/',
				isCompletedValue: '',
				errors: { draftDcoIsCompleted: { msg: 'You must select an answer' } },
				errorSummary: [{ text: 'You must select an answer', href: '#draftDcoIsCompleted' }]
			});
		});
	});
	describe('getAnswersFromRes', () => {
		it('should return answers if present in journeyResponse', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'name',
							emailAddress: 'test@email.com'
						}
					}
				}
			};

			assert.deepStrictEqual(getAnswersFromRes(mockRes), {
				firstName: 'test',
				lastName: 'name',
				emailAddress: 'test@email.com'
			});
		});
		it('should throw an error if res.locals is not present', async () => {
			assert.throws(() => getAnswersFromRes({}));
		});
		it('should throw an error if res.locals.journeyResponse is not present', async () => {
			assert.throws(() => getAnswersFromRes({ locals: {} }));
		});
		it('should throw an error if answers is not an object', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: 'invalid value'
					}
				}
			};
			assert.throws(() => getAnswersFromRes(mockRes));
		});
	});
});
