// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	buildApplicationCompletePage,
	buildDeclarationNamePage,
	buildDeclarationOrganisationPage,
	buildDeclarationPage,
	buildPositionInOrganisationPage,
	buildSaveDeclarationName,
	buildSaveDeclarationOrganisation,
	buildSavePositionInOrganisation,
	buildSubmitDeclaration
} from './controller.ts';
import assert from 'node:assert';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';

describe('declaration controllers', () => {
	describe('buildDeclarationNamePage', () => {
		it('should render your name page', async () => {
			const mockReq = { session: {} };
			const mockRes = {
				render: mock.fn()
			};

			const declarationNamePage = buildDeclarationNamePage();
			await declarationNamePage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-name.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				declarationFirstName: undefined,
				declarationLastName: undefined
			});
		});
	});
	describe('buildSaveDeclarationName', () => {
		it('should save users first and last name to session and redirect to you org page', async () => {
			const mockReq = {
				body: {
					declarationFirstName: 'test',
					declarationLastName: 'name'
				},
				session: {}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const saveDeclarationName = buildSaveDeclarationName({});
			await saveDeclarationName(mockReq, mockRes);

			assert.strictEqual(mockReq.session.declarationFirstName, 'test');
			assert.strictEqual(mockReq.session.declarationLastName, 'name');

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/declaration/organisation');
		});
		it('should render your name page with error if no value provided', async () => {
			const mockReq = {
				body: {
					declarationFirstName: '',
					declarationLastName: ''
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const saveDeclarationName = buildSaveDeclarationName({ logger: mockLogger() });
			await saveDeclarationName(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-name.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				declarationFirstName: '',
				declarationLastName: '',
				errors: {
					declarationFirstName: { msg: 'Enter your first name' },
					declarationLastName: { msg: 'Enter your last name' }
				},
				errorSummary: [
					{
						href: '#declarationFirstName',
						text: 'Enter your first name'
					},
					{
						href: '#declarationLastName',
						text: 'Enter your last name'
					}
				]
			});
		});
		it('should render your name page with error if invalid value provided', async () => {
			const mockReq = {
				body: {
					declarationFirstName: '123',
					declarationLastName: '456'
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const saveDeclarationName = buildSaveDeclarationName({ logger: mockLogger() });
			await saveDeclarationName(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-name.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/',
				declarationFirstName: '123',
				declarationLastName: '456',
				errors: {
					declarationFirstName: { msg: 'First name must only contain letters a to z, apostrophes and hyphens' },
					declarationLastName: { msg: 'Last name must only contain letters a to z, apostrophes and hyphens' }
				},
				errorSummary: [
					{
						href: '#declarationFirstName',
						text: 'First name must only contain letters a to z, apostrophes and hyphens'
					},
					{
						href: '#declarationLastName',
						text: 'Last name must only contain letters a to z, apostrophes and hyphens'
					}
				]
			});
		});
	});
	describe('buildDeclarationOrganisationPage', () => {
		it('should render your organisation page', async () => {
			const mockReq = { session: {} };
			const mockRes = {
				render: mock.fn()
			};

			const declarationOrganisationPage = buildDeclarationOrganisationPage();
			await declarationOrganisationPage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-organisation.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/declaration/name',
				declarationOrganisation: undefined
			});
		});
	});
	describe('buildSaveDeclarationOrganisation', () => {
		it('should save users org to session and redirect to position in org page', async () => {
			const mockReq = {
				body: {
					declarationOrganisation: 'the org'
				},
				session: {}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const saveDeclarationOrganisation = buildSaveDeclarationOrganisation({});
			await saveDeclarationOrganisation(mockReq, mockRes);

			assert.strictEqual(mockReq.session.declarationOrganisation, 'the org');

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/declaration/position-in-organisation');
		});
		it('should render your org page with error if no value provided', async () => {
			const mockReq = {
				body: {
					declarationOrganisation: ''
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const saveDeclarationOrganisation = buildSaveDeclarationOrganisation({ logger: mockLogger() });
			await saveDeclarationOrganisation(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-organisation.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/declaration/name',
				declarationOrganisation: '',
				errors: {
					declarationOrganisation: { msg: 'Enter your organisation' }
				},
				errorSummary: [
					{
						href: '#declarationOrganisation',
						text: 'Enter your organisation'
					}
				]
			});
		});
		it('should render your org page with error if invalid value provided', async () => {
			const mockReq = {
				body: {
					declarationOrganisation: 'inv@lid n@me$'
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const saveDeclarationOrganisation = buildSaveDeclarationOrganisation({ logger: mockLogger() });
			await saveDeclarationOrganisation(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-organisation.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/declaration/name',
				declarationOrganisation: 'inv@lid n@me$',
				errors: {
					declarationOrganisation: {
						msg: 'Organisation must only contain letters a to z, numbers, apostrophes, hyphens, commas and spaces'
					}
				},
				errorSummary: [
					{
						href: '#declarationOrganisation',
						text: 'Organisation must only contain letters a to z, numbers, apostrophes, hyphens, commas and spaces'
					}
				]
			});
		});
		it('should render your org page with error if value provided exceeds 250 characters', async () => {
			const mockReq = {
				body: {
					declarationOrganisation:
						'A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long org name'
				},
				session: {}
			};
			const mockRes = {
				render: mock.fn()
			};

			const saveDeclarationOrganisation = buildSaveDeclarationOrganisation({ logger: mockLogger() });
			await saveDeclarationOrganisation(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/your-organisation.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/declaration/name',
				declarationOrganisation:
					'A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long org name',
				errors: {
					declarationOrganisation: { msg: 'Organisation must be 250 characters or less' }
				},
				errorSummary: [
					{
						href: '#declarationOrganisation',
						text: 'Organisation must be 250 characters or less'
					}
				]
			});
		});
	});
	describe('buildPositionInOrganisationPage', () => {
		it('should render position in org page', async () => {
			const mockReq = { session: {} };
			const mockRes = {
				render: mock.fn()
			};

			const positionInOrganisationPage = buildPositionInOrganisationPage();
			await positionInOrganisationPage(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/declaration/position-in-org.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				backLinkUrl: '/declaration/organisation',
				positionInOrganisation: undefined
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
				backLinkUrl: '/declaration/organisation',
				errors: {
					positionInOrganisation: { msg: 'Enter your position in your organisation' }
				},
				errorSummary: [
					{
						text: 'Enter your position in your organisation',
						href: '#positionInOrganisation'
					}
				],
				positionInOrganisation: ''
			});
		});
		it('should render position in org page with error if invalid value provided', async () => {
			const mockReq = {
				body: {
					positionInOrganisation:
						'A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long position in org'
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
				backLinkUrl: '/declaration/organisation',
				errors: {
					positionInOrganisation: { msg: 'Organisation must be 250 characters or less' }
				},
				errorSummary: [
					{
						text: 'Organisation must be 250 characters or less',
						href: '#positionInOrganisation'
					}
				],
				positionInOrganisation:
					'A really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long position in org'
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
				backLinkUrl: '/declaration/position-in-organisation'
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
					declarationFirstName: 'test',
					declarationLastName: 'name',
					declarationOrganisation: 'the org',
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
					submitterFirstName: 'test',
					submitterLastName: 'name',
					submitterOrganisation: 'the org',
					submitterPositionInOrganisation: 'the boss'
				}
			});

			assert.strictEqual(mockReq.session.declarationFirstName, undefined);
			assert.strictEqual(mockReq.session.declarationLastName, undefined);
			assert.strictEqual(mockReq.session.declarationOrganisation, undefined);
			assert.strictEqual(mockReq.session.positionInOrganisation, undefined);

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
							Representation: {
								representative: {
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
								}
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
				backLinkUrl: '/declaration/position-in-organisation',
				errors: {
					declarationConfirmation: { msg: 'You must confirm you understand and accept the declaration' }
				},
				errorSummary: [
					{
						text: 'You must confirm you understand and accept the declaration',
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
