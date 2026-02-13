// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildAboutTheProjectHomePage } from './controller.ts';
import { PROJECT_SITE_TYPE_IDS } from './constants.ts';

describe('about-the-project controller', () => {
	describe('buildAboutTheProjectHomePage', () => {
		it('should return answers if present and prepopulate checkboxes if supporting evidence is present and answers provided', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [
							{ documentId: 'doc-id-1', subCategoryId: DOCUMENT_SUB_CATEGORY_ID.DETAILS_OF_ASSOCIATED_DEVELOPMENT }
						],
						projectDescription: 'test',
						projectConsentReason: 'consent',
						locationDescription: 'location',
						ProjectSingleSite: {
							easting: 123456,
							northing: 123456
						}
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/description');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						consentReason: 'consent',
						description: 'test',
						locationDescription: 'location',
						singleOrLinear: PROJECT_SITE_TYPE_IDS.SINGLE,
						easting: '123456',
						northing: '123456',
						startEasting: '',
						startNorthing: '',
						middleEasting: '',
						middleNorthing: '',
						endEasting: '',
						endNorthing: '',
						hasAssociatedDevelopments: 'yes',
						associatedDevelopments: 'doc-id-1'
					}
				}
			});
		});
		it('should populate no radio button if no supporting evidence present for case', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [],
						projectDescription: 'test',
						projectConsentReason: 'consent',
						locationDescription: 'location',
						ProjectSingleSite: {
							easting: 123456,
							northing: 123456
						}
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/description');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						consentReason: 'consent',
						description: 'test',
						locationDescription: 'location',
						singleOrLinear: PROJECT_SITE_TYPE_IDS.SINGLE,
						easting: '123456',
						northing: '123456',
						startEasting: '',
						startNorthing: '',
						middleEasting: '',
						middleNorthing: '',
						endEasting: '',
						endNorthing: '',
						hasAssociatedDevelopments: 'no'
					}
				}
			});
		});
		it('should populate linear site cases properly', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						SupportingEvidence: [],
						projectDescription: 'test',
						projectConsentReason: 'consent',
						locationDescription: 'location',
						ProjectLinearSite: {
							startEasting: 123456,
							startNorthing: 123456,
							middleEasting: 123456,
							middleNorthing: 123456,
							endEasting: 123456,
							endNorthing: 123456
						}
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/description');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						consentReason: 'consent',
						description: 'test',
						locationDescription: 'location',
						singleOrLinear: PROJECT_SITE_TYPE_IDS.LINEAR,
						easting: '',
						northing: '',
						startEasting: '123456',
						startNorthing: '123456',
						middleEasting: '123456',
						middleNorthing: '123456',
						endEasting: '123456',
						endNorthing: '123456',
						hasAssociatedDevelopments: 'no'
					}
				}
			});
		});
		it('should not skip populateForm if status is not-started and just prepopulate with blank values', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/about-the-project',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildAboutTheProjectHomePage({ db: mockDb }, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/about-the-project/about/description');

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'about-the-project': {
						consentReason: '',
						description: '',
						locationDescription: '',
						singleOrLinear: null,
						easting: '',
						northing: '',
						startEasting: '',
						startNorthing: '',
						middleEasting: '',
						middleNorthing: '',
						endEasting: '',
						endNorthing: '',
						hasAssociatedDevelopments: 'no'
					}
				}
			});
		});
	});
});
