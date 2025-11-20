// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildHomePage } from './controller.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { configureNunjucks } from '../../nunjucks.ts';

describe('home page', () => {
	it('should render without error', async () => {
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
