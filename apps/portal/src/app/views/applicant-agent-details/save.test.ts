// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('applicant agent details journey save controller', () => {
	describe('buildSaveController', () => {
		it('should save uploaded documents into the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(async () => ({
						reference: 'EN123456'
					})),
					update: mock.fn(async () => 'document-id')
				},
				contactDetails: {
					update: mock.fn(async () => ({ id: 'contact-id-1' })),
					create: mock.fn(async () => ({ id: 'contact-id-1' }))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'person',
							emailAddress: 'test@solirius.com',
							phone: '0711111111',
							fax: '111111111',
							address: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							organisation: 'test org',
							paymentMethod: 'cheque',
							paymentReference: 'pay123'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			// TODO: reinstate check for redirect back to applicant and agent details homepage when thats been implemented
			//assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/applicant-and-agent-details');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					ApplicantDetails: {
						create: {
							firstName: 'test',
							lastName: 'person',
							emailAddress: 'test@solirius.com',
							phone: '0711111111',
							fax: '111111111',
							organisation: 'test org',
							paymentReference: 'pay123',
							PaymentMethod: {
								connect: {
									id: 'cheque'
								}
							},
							Address: {
								create: {
									addressLine1: '1',
									addressLine2: 'test way',
									townCity: 'testville',
									county: 'testshire',
									country: 'testy kingdom',
									postcode: 'te12 5ty'
								}
							}
						}
					}
				}
			});
			assert.deepStrictEqual(mockDb.case.update.mock.calls[1].arguments[0], {
				data: {
					applicantAndAgentDetailsStatusId: 'in-progress'
				},
				where: {
					reference: 'EN123456'
				}
			});
		});
		it('should save uploaded documents into the database but not update status if already in progress', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						applicantAndAgentDetailsStatusId: 'in-progress'
					})),
					update: mock.fn(async () => 'document-id')
				},
				contactDetails: {
					update: mock.fn(async () => ({ id: 'contact-id-1' })),
					create: mock.fn(async () => ({ id: 'contact-id-1' }))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'person',
							emailAddress: 'test@solirius.com',
							phone: '0711111111',
							fax: '111111111',
							address: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							organisation: 'test org',
							paymentMethod: 'cheque',
							paymentReference: 'pay123'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			// TODO: reinstate check for redirect back to applicant and agent details homepage when thats been implemented
			//assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/applicant-and-agent-details');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					ApplicantDetails: {
						create: {
							firstName: 'test',
							lastName: 'person',
							emailAddress: 'test@solirius.com',
							phone: '0711111111',
							fax: '111111111',
							organisation: 'test org',
							paymentReference: 'pay123',
							PaymentMethod: {
								connect: {
									id: 'cheque'
								}
							},
							Address: {
								create: {
									addressLine1: '1',
									addressLine2: 'test way',
									townCity: 'testville',
									county: 'testshire',
									country: 'testy kingdom',
									postcode: 'te12 5ty'
								}
							}
						}
					}
				}
			});
		});
		it('should save uploaded documents into the database and update the existing contact record if it exists', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ApplicantDetails: {
							id: 'contact-id'
						}
					})),
					update: mock.fn(async () => 'document-id')
				},
				contactDetails: {
					create: mock.fn(async () => 'document-id'),
					update: mock.fn(async () => 'document-id')
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'person',
							emailAddress: 'test@solirius.com',
							phone: '0711111111',
							fax: '111111111',
							address: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							organisation: 'test org',
							paymentMethod: 'cheque',
							paymentReference: 'pay123'
						}
					}
				}
			};

			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			// TODO: reinstate check for redirect back to applicant and agent details homepage when thats been implemented
			//assert.strictEqual(mockRes.redirect.mock.calls[0].arguments[0], '/applicant-and-agent-details');

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.contactDetails.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.contactDetails.update.mock.calls[0].arguments[0], {
				where: { id: 'contact-id' },
				data: {
					firstName: 'test',
					lastName: 'person',
					emailAddress: 'test@solirius.com',
					phone: '0711111111',
					fax: '111111111',
					organisation: 'test org',
					paymentReference: 'pay123',
					PaymentMethod: {
						connect: {
							id: 'cheque'
						}
					},
					Address: {
						upsert: {
							create: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							update: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							}
						}
					}
				}
			});

			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				data: {
					applicantAndAgentDetailsStatusId: 'in-progress'
				},
				where: {
					reference: 'EN123456'
				}
			});
		});
		it('should throw if error encountered during database operations', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({ reference: 'EN123456' }))
				},
				applicantAgentDetails: {
					create: mock.fn(() => {
						throw new Prisma.PrismaClientKnownRequestError('Error', { code: 'E1' });
					})
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn(),
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'person',
							organisation: 'test org',
							paymentMethod: 'cheque',
							paymentReference: 'pay123'
						}
					}
				}
			};
			const controller = buildSaveController(
				{
					db: mockDb,
					logger: mockLogger()
				},
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await assert.rejects(() => controller({}, mockRes), { message: 'error saving applicant agent details journey' });
		});
		it('should throw if res.locals is not present', async () => {
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS);
			await assert.rejects(() => controller({}, {}), { message: 'journey response required' });
		});
		it('should throw if res.locals.journeyResponse is not present', async () => {
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS);
			await assert.rejects(() => controller({}, { locals: {} }), { message: 'journey response required' });
		});
		it('should throw if answers is not an object', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: 'answers'
					}
				}
			};
			const controller = buildSaveController({}, APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS);
			await assert.rejects(() => controller({}, mockRes), { message: 'answers should be an object' });
		});
	});
});
