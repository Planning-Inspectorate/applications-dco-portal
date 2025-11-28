// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildSaveController } from './save.ts';
import { mockLogger } from '@pins/dco-portal-lib/testing/mock-logger.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';

describe('applicant agent details journey save controller', () => {
	describe('buildSaveController', () => {
		it('should save applicant details into the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456'
					})),
					update: mock.fn(() => 'document-id')
				},
				contactDetails: {
					update: mock.fn(() => ({ id: 'contact-id-1' }))
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: { disconnect: true },
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
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
		it('should save applicant details into the database but not update status if already in progress', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						applicantAndAgentDetailsStatusId: 'in-progress'
					})),
					update: mock.fn(() => 'document-id')
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: { disconnect: true },
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
						}
					}
				}
			});
		});
		it('should save applicant details into the database and update the existing contact record if it exists', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ApplicantDetails: {
							id: 'contact-id'
						}
					})),
					update: mock.fn(() => 'document-id')
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: { disconnect: true },
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
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
		it('should save applicant and agent details to the database', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456'
					})),
					update: mock.fn(() => 'document-id')
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
							isAgent: 'yes',
							agentFirstName: 'agent',
							agentLastName: 'person',
							agentEmailAddress: 'agent@solirius.com',
							agentPhone: '0711111111',
							agentFax: '111111111',
							agentAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'agentsville',
								county: 'agentshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							agentOrganisation: 'test org',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: {
						upsert: {
							update: {
								firstName: 'agent',
								lastName: 'person',
								emailAddress: 'agent@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'agentsville',
											county: 'agentshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
										create: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'agentsville',
											county: 'agentshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										}
									}
								}
							},
							create: {
								firstName: 'agent',
								lastName: 'person',
								emailAddress: 'agent@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									create: {
										addressLine1: '1',
										addressLine2: 'test way',
										townCity: 'agentsville',
										county: 'agentshire',
										country: 'testy kingdom',
										postcode: 'te12 5ty'
									}
								}
							}
						}
					},
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
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
		it('should save applicant and agent details to the database and update the existing contact record if it exists', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ApplicantDetails: {
							id: 'contact-id'
						},
						AgentDetails: {
							id: 'agent-contact-id'
						}
					})),
					update: mock.fn(() => 'document-id')
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
							isAgent: 'yes',
							agentFirstName: 'agent',
							agentLastName: 'person',
							agentEmailAddress: 'agent@solirius.com',
							agentPhone: '0711111111',
							agentFax: '111111111',
							agentAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'agentsville',
								county: 'agentshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							agentOrganisation: 'test org',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: {
						upsert: {
							update: {
								firstName: 'agent',
								lastName: 'person',
								emailAddress: 'agent@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'agentsville',
											county: 'agentshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
										create: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'agentsville',
											county: 'agentshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										}
									}
								}
							},
							create: {
								firstName: 'agent',
								lastName: 'person',
								emailAddress: 'agent@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									create: {
										addressLine1: '1',
										addressLine2: 'test way',
										townCity: 'agentsville',
										county: 'agentshire',
										country: 'testy kingdom',
										postcode: 'te12 5ty'
									}
								}
							}
						}
					},
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
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
		it('should handle agent details being removed after being previously provided', async () => {
			const mockDb = {
				$transaction: mock.fn((fn) => fn(mockDb)),
				case: {
					findUnique: mock.fn(() => ({
						reference: 'EN123456',
						ApplicantDetails: {
							id: 'contact-id'
						},
						AgentDetails: {
							id: 'agent-contact-id'
						}
					})),
					update: mock.fn(() => 'document-id')
				},
				contactDetails: {
					delete: mock.fn(() => {})
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
							applicantFirstName: 'test',
							applicantLastName: 'person',
							applicantEmailAddress: 'test@solirius.com',
							applicantPhone: '0711111111',
							applicantFax: '111111111',
							applicantAddress: {
								addressLine1: '1',
								addressLine2: 'test way',
								townCity: 'testville',
								county: 'testshire',
								country: 'testy kingdom',
								postcode: 'te12 5ty'
							},
							applicantOrganisation: 'test org',
							isAgent: 'no',
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

			assert.strictEqual(mockDb.case.findUnique.mock.callCount(), 1);
			assert.strictEqual(mockDb.contactDetails.delete.mock.callCount(), 1);
			assert.deepStrictEqual(mockDb.contactDetails.delete.mock.calls[0].arguments[0], {
				where: { id: 'agent-contact-id' }
			});
			assert.strictEqual(mockDb.case.update.mock.callCount(), 2);
			assert.deepStrictEqual(mockDb.case.update.mock.calls[0].arguments[0], {
				where: { reference: 'EN123456' },
				data: {
					paymentReference: 'pay123',
					ApplicantDetails: {
						upsert: {
							update: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
								Address: {
									upsert: {
										update: {
											addressLine1: '1',
											addressLine2: 'test way',
											townCity: 'testville',
											county: 'testshire',
											country: 'testy kingdom',
											postcode: 'te12 5ty'
										},
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
							},
							create: {
								firstName: 'test',
								lastName: 'person',
								emailAddress: 'test@solirius.com',
								phone: '0711111111',
								fax: '111111111',
								organisation: 'test org',
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
					},
					AgentDetails: { disconnect: true },
					CasePaymentMethod: {
						connect: {
							id: 'cheque'
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
	});
});
