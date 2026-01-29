// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildApplicationCompletePage,
	buildDeclarationPage,
	buildPositionInOrganisationPage,
	buildSavePositionInOrganisation,
	buildSubmitDeclaration
} from './controller.ts';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('declaration controllers', () => {
	describe('buildPositionInOrganisationPage', () => {
		it('should render position in org page', async () => {
			const mockRes = {
				render: mock.fn()
			};

			const positionInOrganisationPage = buildPositionInOrganisationPage();
			await positionInOrganisationPage({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/position-in-org.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/'
			});
		});
	});
	describe('buildSavePositionInOrganisation', () => {
		it('should save position in org to session and redirect to declaration page', async () => {
			const mockReq = {
				body: {
					positionInOrganisation: 'the boss'
				},
				session: {}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const savePositionInOrganisation = buildSavePositionInOrganisation({});
			await savePositionInOrganisation(mockReq, mockRes);

			assert.strictEqual(mockReq.session.positionInOrganisation, 'the boss');

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/declaration');
		});
		it('should render position in org page with error if no value provided', async () => {
			const mockReq = {
				body: {
					positionInOrganisation: ''
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const savePositionInOrganisation = buildSavePositionInOrganisation({ logger: mockLogger() });
			await savePositionInOrganisation(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/position-in-org.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				errors: {
					positionInOrganisation: { msg: 'You must select an answer' }
				},
				errorSummary: [
					{
						text: 'You must select an answer',
						href: '#positionInOrganisation'
					}
				]
			});
		});
		it('should render position in org page with error if invalid value provided', async () => {
			const mockReq = {
				body: {
					positionInOrganisation: 'the boss 123'
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const savePositionInOrganisation = buildSavePositionInOrganisation({ logger: mockLogger() });
			await savePositionInOrganisation(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/position-in-org.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				errors: {
					positionInOrganisation: { msg: 'Your answer must contain only letters' }
				},
				errorSummary: [
					{
						text: 'Your answer must contain only letters',
						href: '#positionInOrganisation'
					}
				]
			});
		});
	});
	describe('buildDeclarationPage', () => {
		it('should render declaration page', async () => {
			const mockRes = {
				render: mock.fn()
			};

			const declarationPage = buildDeclarationPage();
			await declarationPage({}, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/declaration.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/position-in-organisation'
			});
		});
	});
	describe('buildSubmitDeclaration', () => {
		it('should successfully update case and redirect to confirmation page', async (ctx) => {
			const now = new Date('2025-01-30T00:00:07.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockReq = {
				body: {
					declarationConfirmation: 'confirm'
				},
				session: {
					caseReference: 'EN123456',
					positionInOrganisation: 'the boss'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};
			const mockDb = {
				case: {
					update: mock.fn(),
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						projectDescription: 'This is an important case',
						locationDescription: 'It is a big piece of land',
						ApplicantDetails: {
							id: 'contact-id',
							lastName: 'Bob',
							phone: '0777777777777',
							emailAddress: 'test@email.com',
							organisation: 'Applicant Organisation',
							Address: {
								addressLine1: 'App line 1',
								addressLine2: 'App line 2',
								townCity: 'London',
								county: 'Greater London',
								country: 'England',
								postcode: 'W1 1BW'
							}
						},
						AgentDetails: {
							id: 'agent-contact-id',
							lastName: 'Bond',
							phone: '0772757777778',
							emailAddress: 'agent@email.com',
							organisation: 'Agent Organisation',
							Address: {
								addressLine1: 'Agent Line 1',
								addressLine2: 'Agent Line 2',
								townCity: 'Manchester',
								county: 'Greater Manchester',
								country: 'England',
								postcode: 'M1 1BW'
							}
						},
						ProjectSingleSite: {
							northing: 123456,
							easting: 123456
						}
					}))
				},
				document: {
					findMany: mock.fn(() => [
						{
							fileName: 'test.pdf',
							size: 208,
							formattedSize: '208B',
							blobName: `EN123456/draft-dco/test.pdf`,
							mimeType: 'application/pdf',
							uploaderEmail: 'test@email.com',
							Case: {
								id: 'case-id-1'
							},
							SubCategory: {
								displayName: 'test sub category',
								Category: {
									displayName: 'test category'
								}
							}
						},
						{
							fileName: 'plan.pdf',
							size: 500,
							formattedSize: '500B',
							blobName: `EN123456/draft-dco/plan.pdf`,
							mimeType: 'application/pdf',
							uploaderEmail: 'test@email.com',
							Case: {
								id: 'case-id-1'
							},
							SubCategory: {
								displayName: 'test sub category',
								Category: {
									displayName: 'test category'
								}
							}
						}
					])
				},
				whitelistUser: {
					findMany: mock.fn(() => [
						{ email: 'user-1@email.com' },
						{ email: 'user-2@email.com' },
						{ email: 'user-3@email.com' }
					])
				}
			};
			const mockBlobStore = {
				moveFolder: mock.fn()
			};
			const mockServiceBusClient = {
				sendEvents: mock.fn()
			};
			const mockGovNotifyClient = {
				sendApplicantSubmissionNotification: mock.fn(),
				sendPinsStaffSubmissionNotification: mock.fn()
			};

			const submitDeclaration = buildSubmitDeclaration({
				db: mockDb,
				logger: mockLogger(),
				blobStore: mockBlobStore,
				serviceBusEventClient: mockServiceBusClient,
				notifyClient: mockGovNotifyClient
			});
			await submitDeclaration(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/application-complete');

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: {
					reference: 'EN123456'
				},
				data: {
					submissionDate: new Date('2025-01-30T00:00:07.000Z'),
					submitterPositionInOrganisation: 'the boss'
				}
			});
			assert.strictEqual(mockBlobStore.moveFolder.mock.callCount(), 1);
			assert.strictEqual(mockBlobStore.moveFolder.mock.calls[0].arguments[0], 'EN123456');

			assert.strictEqual(mockServiceBusClient.sendEvents.mock.callCount(), 1);
			assert.deepStrictEqual(mockServiceBusClient.sendEvents.mock.calls[0].arguments[0], 'dco-portal-data-submissions');
			assert.deepStrictEqual(mockServiceBusClient.sendEvents.mock.calls[0].arguments[1], [
				{
					mappedCaseData: {
						case: {
							ApplicationDetails: {
								locationDescription: 'It is a big piece of land',
								submissionAtInternal: new Date('2025-01-30T00:00:07.000Z')
							},
							agent: {
								Address: {
									addressLine1: 'Agent Line 1',
									addressLine2: 'Agent Line 2',
									country: 'England',
									county: 'Greater Manchester',
									postcode: 'M1 1BW',
									town: 'Manchester'
								},
								email: 'agent@email.com',
								lastName: 'Bond',
								organisationName: 'Agent Organisation',
								phoneNumber: '0772757777778'
							},
							applicant: {
								Address: {
									addressLine1: 'App line 1',
									addressLine2: 'App line 2',
									country: 'England',
									county: 'Greater London',
									postcode: 'W1 1BW',
									town: 'London'
								},
								email: 'test@email.com',
								jobTitle: 'the boss',
								lastName: 'Bob',
								organisationName: 'Applicant Organisation',
								phoneNumber: '0777777777777'
							},
							description: 'This is an important case',
							gridReference: {
								easting: 123456,
								northing: 123456
							},
							reference: 'EN123456'
						}
					},
					mappedDocuments: [
						{
							blobStoreUrl: 'EN123456/draft-dco/test.pdf',
							caseId: 'case-id-1',
							documentName: 'test.pdf',
							documentReference: 'test sub category',
							documentSize: 208,
							documentType: 'application/pdf',
							folderName: 'test category',
							username: 'test@email.com'
						},
						{
							blobStoreUrl: 'EN123456/draft-dco/plan.pdf',
							caseId: 'case-id-1',
							documentName: 'plan.pdf',
							documentReference: 'test sub category',
							documentSize: 500,
							documentType: 'application/pdf',
							folderName: 'test category',
							username: 'test@email.com'
						}
					]
				}
			]);
			assert.deepStrictEqual(mockServiceBusClient.sendEvents.mock.calls[0].arguments[2], 'Publish');
			assert.strictEqual(mockGovNotifyClient.sendApplicantSubmissionNotification.mock.callCount(), 3);
			assert.strictEqual(mockGovNotifyClient.sendPinsStaffSubmissionNotification.mock.callCount(), 1);
		});
		it('should render declaration page with error if checkbox not selected', async (ctx) => {
			const now = new Date('2025-01-30T00:00:07.000Z');
			ctx.mock.timers.enable({ apis: ['Date'], now });

			const mockReq = {
				body: {
					declarationConfirmation: ''
				},
				session: {
					caseReference: 'EN123456',
					positionInOrganisation: 'the boss'
				}
			};
			const mockRes = {
				render: mock.fn()
			};

			const submitDeclaration = buildSubmitDeclaration({ logger: mockLogger() });
			await submitDeclaration(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/declaration.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/position-in-organisation',
				errors: {
					declarationConfirmation: { msg: 'You must confirm that you understand and accept this declaration' }
				},
				errorSummary: [
					{
						text: 'You must confirm that you understand and accept this declaration',
						href: '#declarationConfirmation'
					}
				]
			});
		});
	});
	describe('buildApplicationCompletePage', () => {
		it('should render application complete page', async () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				render: mock.fn()
			};
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						submissionDate: new Date(2025, 11, 12)
					}))
				}
			};

			const applicationCompletePage = buildApplicationCompletePage({ db: mockDb });
			await applicationCompletePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/application-complete.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				caseReference: 'EN123456',
				dateSubmitted: '12:00AM on 12 December 2025'
			});
		});
		it('should render not found page if case data cannot be fetched', async () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
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

			const applicationCompletePage = buildApplicationCompletePage({ db: mockDb });
			await applicationCompletePage(mockReq, mockRes);

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
