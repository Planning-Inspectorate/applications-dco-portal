// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildHomePage, buildSubmitHomePageController } from './controller.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { configureNunjucks } from '../../nunjucks.ts';
import { DOCUMENT_CATEGORY_STATUS_ID, WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { buildSaveController } from '../whitelist/remove/controller.ts';

describe('views/home/controller.ts', () => {
	describe('home page', () => {
		it('should render without error', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const nunjucks = configureNunjucks();
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						email: 'test@email.com',
						applicationFormRelatedInformationStatusId: 'not-started',
						plansAndDrawingsStatusId: 'not-started',
						draftDcoStatusId: 'in-progress',
						compulsoryAcquisitionInformationStatusId: 'not-started',
						consultationReportStatusId: 'completed',
						reportsAndStatementsStatusId: 'not-started',
						environmentalStatementStatusId: 'not-started',
						additionalPrescribedInformationStatusId: 'not-started',
						otherDocumentsStatusId: 'not-started'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						userRoleId: WHITELIST_USER_ROLE_ID.STANDARD_USER
					}))
				}
			};

			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn((view, data) => nunjucks.render(view, data))
			};

			const homePage = buildHomePage({ db: mockDb, logger: mockLogger() });
			await assert.doesNotReject(() => homePage(mockReq, mockRes));

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'EN123456',
				showManageUsersLink: false,
				enableSubmissionButton: false,
				hasCaseBeenSubmitted: false,
				submissionText: '<h2 class="govuk-heading-m">Confirm your submission date</h2>',
				warningText: 'You cannot submit your application yet.',
				submissionInformation:
					'<p class="govuk-body">To submit, you must <a class="govuk-link govuk-link--no-visited-state" href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/contact" target="_blank" rel="noreferrer">contact the Planning Inspectorate (opens in new tab)</a> to confirm you submission date.</p>',
				taskListItems: {
					yourDocuments: [
						{
							href: '/application-form-related-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Application form related information'
							}
						},
						{
							href: '/plans-and-drawings',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Plans and drawings'
							}
						},
						{
							href: '/draft-dco',
							status: {
								tag: {
									classes: 'govuk-tag--yellow',
									text: 'In progress'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Draft DCO'
							}
						},
						{
							href: '/compulsory-acquisition-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Compulsory acquisition information'
							}
						},
						{
							href: '/consultation-report',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Consultation report'
							}
						},
						{
							href: '/reports-and-statements',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Reports and statements'
							}
						},
						{
							href: '/environmental-statement',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Environmental statement'
							}
						},
						{
							href: '/additional-prescribed-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Additional prescribed information (optional)'
							}
						},
						{
							href: '/other-documents',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other documents (optional)'
							}
						}
					],
					yourApplication: [
						{
							href: '/applicant-and-agent-details',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Applicant and agent details'
							}
						},
						{
							href: '/about-the-project',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'About the project'
							}
						},
						{
							href: '/consultation-and-publicity-details',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Consultation and publicity details'
							}
						},
						{
							href: '/draft-order-and-explanatory-memorandum',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Draft order and explanatory memorandum'
							}
						},
						{
							href: '/land-and-works-plans',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Land and works plans'
							}
						},
						{
							href: '/land-rights-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Land rights information'
							}
						},
						{
							href: '/environmental-impact-assessment-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Environmental impact assessment information'
							}
						},
						{
							href: '/habitat-regulations-assessment-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Habitat regulations assessment information'
							}
						},
						{
							href: '/nature-conservation-and-environmental-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Nature conservation and environmental information'
							}
						},
						{
							href: '/flood-risk-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Flood risk information'
							}
						},
						{
							href: '/statutory-nuisance-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Statutory nuisance information'
							}
						},
						{
							href: '/crown-land-access-and-rights-of-way-plans',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Crown land, access, and rights of way plans'
							}
						},
						{
							href: '/infrastructure-specific-additional-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Infrastructure-specific additional information'
							}
						},
						{
							href: '/other-plans-and-reports',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other plans and reports (optional)'
							}
						},
						{
							href: '/other-consents-or-licences-details',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other consents or licences details'
							}
						}
					]
				}
			});
		});
		it('should render with submission date in the future content', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const nunjucks = configureNunjucks();
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						email: 'test@email.com',
						anticipatedDateOfSubmission: new Date('2025-02-03T00:00:00.000Z'),
						applicationFormRelatedInformationStatusId: 'not-started',
						plansAndDrawingsStatusId: 'not-started',
						draftDcoStatusId: 'in-progress',
						compulsoryAcquisitionInformationStatusId: 'not-started',
						consultationReportStatusId: 'completed',
						reportsAndStatementsStatusId: 'not-started',
						environmentalStatementStatusId: 'not-started',
						additionalPrescribedInformationStatusId: 'not-started',
						otherDocumentsStatusId: 'not-started'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						userRoleId: WHITELIST_USER_ROLE_ID.STANDARD_USER
					}))
				}
			};

			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn((view, data) => nunjucks.render(view, data))
			};

			const homePage = buildHomePage({ db: mockDb, logger: mockLogger() });
			await assert.doesNotReject(() => homePage(mockReq, mockRes));

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[1].enableSubmissionButton, false);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].submissionText,
				'<h2 class="govuk-heading-m">You will be able to submit you application on 3 Feb 2025</h2><p class="govuk-body">Once the applications is submitted, it will be locked and you can make no further changes.</p>'
			);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].warningText,
				"If you miss this date, you'll need to agree a new submission date with the Planning Inspectorate"
			);
		});
		it('should render with you can now submit content if submission date is tomorrow', async (ctx) => {
			const now = new Date('2025-01-29T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const nunjucks = configureNunjucks();
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						email: 'test@email.com',
						anticipatedDateOfSubmission: new Date('2025-01-30T00:00:00.000Z'),
						applicationFormRelatedInformationStatusId: 'not-started',
						plansAndDrawingsStatusId: 'not-started',
						draftDcoStatusId: 'in-progress',
						compulsoryAcquisitionInformationStatusId: 'not-started',
						consultationReportStatusId: 'completed',
						reportsAndStatementsStatusId: 'not-started',
						environmentalStatementStatusId: 'not-started',
						additionalPrescribedInformationStatusId: 'not-started',
						otherDocumentsStatusId: 'not-started'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						userRoleId: WHITELIST_USER_ROLE_ID.STANDARD_USER
					}))
				}
			};

			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn((view, data) => nunjucks.render(view, data))
			};

			const homePage = buildHomePage({ db: mockDb, logger: mockLogger() });
			await assert.doesNotReject(() => homePage(mockReq, mockRes));

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[1].enableSubmissionButton, true);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].submissionText,
				'<h2 class="govuk-heading-m">Now submit your application</h2><p class="govuk-body">You can now submit your application. Once the application is submitted, it will be locked and you can make no further changes.</p>'
			);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].warningText,
				"If you do not submit your application today, you'll need to agree a new submission date with the Planning Inspectorate"
			);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[1].submissionInformation, '');
		});
		it('should render with submission date has passed content', async (ctx) => {
			const now = new Date('2025-02-04T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const nunjucks = configureNunjucks();
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						email: 'test@email.com',
						anticipatedDateOfSubmission: new Date('2025-01-30T00:00:00.000Z'),
						applicationFormRelatedInformationStatusId: 'not-started',
						plansAndDrawingsStatusId: 'not-started',
						draftDcoStatusId: 'in-progress',
						compulsoryAcquisitionInformationStatusId: 'not-started',
						consultationReportStatusId: 'completed',
						reportsAndStatementsStatusId: 'not-started',
						environmentalStatementStatusId: 'not-started',
						additionalPrescribedInformationStatusId: 'not-started',
						otherDocumentsStatusId: 'not-started'
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						userRoleId: WHITELIST_USER_ROLE_ID.STANDARD_USER
					}))
				}
			};

			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn((view, data) => nunjucks.render(view, data))
			};

			const homePage = buildHomePage({ db: mockDb, logger: mockLogger() });
			await assert.doesNotReject(() => homePage(mockReq, mockRes));

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[1].enableSubmissionButton, false);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].submissionText,
				'<h2 class="govuk-heading-m">Your submission date has passed</h2>'
			);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].warningText,
				'You cannot submit your application at this time.'
			);
			assert.strictEqual(
				mockRes.render.mock.calls[0].arguments[1].submissionInformation,
				'<p class="govuk-body">You can continue working on your application, but you must <a class="govuk-link govuk-link--no-visited-state" href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/contact" target="_blank" rel="noreferrer">contact the Planning Inspectorate (opens in new tab)</a> to agree a new submission date.</p>'
			);
		});
		it('should render not found error page if no email present', async () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const homePage = buildHomePage({});
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
		});
		it('should render not found error page if no case reference present', async () => {
			const mockReq = {
				session: {
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const homePage = buildHomePage({});
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
		});
		it('should render not found error page if neither email or case reference present', async () => {
			const mockReq = {
				session: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const homePage = buildHomePage({});
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
		});
		it('should render not found error page if case not found in database for case reference', async () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const mockDb = {
				case: {
					findUnique: mock.fn()
				}
			};

			const homePage = buildHomePage({ db: mockDb });
			await homePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
		});
	});
	describe('submit home page controller', () => {
		it('should submit home page without error', async (ctx) => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						applicationFormRelatedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						plansAndDrawingsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						draftDcoStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						compulsoryAcquisitionInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						consultationReportStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						reportsAndStatementsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						environmentalStatementStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						consultationAndPublicityDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						draftOrderAndExplanatoryMemorandumStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						landAndWorksPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						landRightsInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						habitatRegulationsAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						floodRiskInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						statutoryNuisanceInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						infrastructureSpecificAdditionalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						otherConsentsOrLicencesDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						additionalPrescribedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
						otherDocumentsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
						otherPlansAndReportsStatusId: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS
					}))
				}
			};

			const submitHomePageController = buildSubmitHomePageController({ db: mockDb });
			await submitHomePageController(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/position-in-organisation');
		});
		it('should return error and render homepage with error if not all mandatory sections completed', async (ctx) => {
			const now = new Date('2025-01-30T00:00:00.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const nunjucks = configureNunjucks();

			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						email: 'test@email.com',
						applicationFormRelatedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						plansAndDrawingsStatusId: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS,
						draftDcoStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						compulsoryAcquisitionInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						consultationReportStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						reportsAndStatementsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						environmentalStatementStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						consultationAndPublicityDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						draftOrderAndExplanatoryMemorandumStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						landAndWorksPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						landRightsInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						environmentalImpactAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						habitatRegulationsAssessmentInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						natureConservationAndEnvironmentalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						floodRiskInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						statutoryNuisanceInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						crownLandAccessAndRightsOfWayPlansStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						infrastructureSpecificAdditionalInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						otherConsentsOrLicencesDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						additionalPrescribedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
						otherDocumentsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
						otherPlansAndReportsStatusId: DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS
					}))
				},
				whitelistUser: {
					findUnique: mock.fn(() => ({
						userRoleId: WHITELIST_USER_ROLE_ID.STANDARD_USER
					}))
				}
			};

			const mockReq = {
				session: {
					caseReference: 'EN123456',
					emailAddress: 'test@email.com'
				},
				body: {}
			};
			const mockRes = {
				render: mock.fn((view, data) => nunjucks.render(view, data))
			};

			const submitHomePageController = buildSubmitHomePageController({ db: mockDb });
			await submitHomePageController(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments.length, 2);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/home/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'EN123456',
				showManageUsersLink: false,
				enableSubmissionButton: false,
				hasCaseBeenSubmitted: false,
				submissionText: '<h2 class="govuk-heading-m">Confirm your submission date</h2>',
				warningText: 'You cannot submit your application yet.',
				submissionInformation:
					'<p class="govuk-body">To submit, you must <a class="govuk-link govuk-link--no-visited-state" href="https://national-infrastructure-consenting.planninginspectorate.gov.uk/contact" target="_blank" rel="noreferrer">contact the Planning Inspectorate (opens in new tab)</a> to confirm you submission date.</p>',
				taskListItems: {
					yourDocuments: [
						{
							href: '/application-form-related-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Application form related information'
							}
						},
						{
							href: '/plans-and-drawings',
							status: {
								tag: {
									classes: 'govuk-tag--yellow',
									text: 'In progress'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Plans and drawings'
							}
						},
						{
							href: '/draft-dco',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Draft DCO'
							}
						},
						{
							href: '/compulsory-acquisition-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Compulsory acquisition information'
							}
						},
						{
							href: '/consultation-report',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Consultation report'
							}
						},
						{
							href: '/reports-and-statements',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Reports and statements'
							}
						},
						{
							href: '/environmental-statement',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Environmental statement'
							}
						},
						{
							href: '/additional-prescribed-information',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Additional prescribed information (optional)'
							}
						},
						{
							href: '/other-documents',
							status: {
								tag: {
									classes: 'govuk-tag--grey',
									text: 'Not yet started'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other documents (optional)'
							}
						}
					],
					yourApplication: [
						{
							href: '/applicant-and-agent-details',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Applicant and agent details'
							}
						},
						{
							href: '/about-the-project',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'About the project'
							}
						},
						{
							href: '/consultation-and-publicity-details',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Consultation and publicity details'
							}
						},
						{
							href: '/draft-order-and-explanatory-memorandum',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Draft order and explanatory memorandum'
							}
						},
						{
							href: '/land-and-works-plans',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Land and works plans'
							}
						},
						{
							href: '/land-rights-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Land rights information'
							}
						},
						{
							href: '/environmental-impact-assessment-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Environmental impact assessment information'
							}
						},
						{
							href: '/habitat-regulations-assessment-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Habitat regulations assessment information'
							}
						},
						{
							href: '/nature-conservation-and-environmental-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Nature conservation and environmental information'
							}
						},
						{
							href: '/flood-risk-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Flood risk information'
							}
						},
						{
							href: '/statutory-nuisance-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Statutory nuisance information'
							}
						},
						{
							href: '/crown-land-access-and-rights-of-way-plans',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Crown land, access, and rights of way plans'
							}
						},
						{
							href: '/infrastructure-specific-additional-information',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Infrastructure-specific additional information'
							}
						},
						{
							href: '/other-plans-and-reports',
							status: {
								tag: {
									classes: 'govuk-tag--yellow',
									text: 'In progress'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other plans and reports (optional)'
							}
						},
						{
							href: '/other-consents-or-licences-details',
							status: {
								tag: {
									classes: 'govuk-tag--blue',
									text: 'Completed'
								}
							},
							title: {
								classes: 'govuk-link--no-visited-state',
								text: 'Other consents or licences details'
							}
						}
					]
				},
				errors: {
					submission: {
						msg: 'You must complete all required sections before sending your application'
					}
				},
				errorSummary: [
					{
						text: 'You must complete all required sections before sending your application',
						href: '#'
					}
				]
			});
		});
		it('should render not found page if caseReference req param not present', async () => {
			const mockReq = {
				session: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const submitHomePageController = buildSubmitHomePageController({});
			await submitHomePageController(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.status.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/layouts/error');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Page not found',
				messages: [
					'If you typed the web address, check it is correct.',
					'If you pasted the web address, check you copied the entire address.'
				]
			});
		});
	});
});
