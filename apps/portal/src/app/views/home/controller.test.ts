// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildHomePage } from './controller.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { configureNunjucks } from '../../nunjucks.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

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
		assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
			pageTitle: 'Application reference number',
			showManageUsersLink: false,
			enableSubmissionButton: true,
			hasCaseBeenSubmitted: true,
			submissionText:
				'<h2 class="govuk-heading-m">Now submit your application</h2><p class="govuk-body">You can now submit your application. Once the application is submitted, it will be locked and you can make no further changes.</p>',
			warningText:
				"If you do not submit your application today, you'll need to agree a new submission date with the Planning Inspectorate",
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
							text: 'Additional prescribed information'
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
							text: 'Other documents'
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
							text: 'Other plans and reports'
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
