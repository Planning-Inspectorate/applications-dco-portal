// @ts-nocheck

import { describe, it, mock } from 'node:test';
import {
	DOCUMENT_CATEGORY_STATUS_ID,
	DOCUMENT_SUB_CATEGORY_ID
} from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from '../constants.ts';
import assert from 'node:assert';
import { buildApplicantAgentDetailsHomePage } from './controller.ts';

describe('applicant-agent-details controller', () => {
	describe('buildApplicantAgentDetailsHomePage', () => {
		it('should prepopulate answers if previously answered with no agent details', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						ApplicantDetails: {
							organisation: 'org',
							firstName: 'john',
							lastName: 'burrows',
							emailAddress: 'email@john.com',
							phone: '0998888888',
							Address: {
								addressLine1: '38',
								addressLine2: 'john burrows way',
								townCity: 'harpenden',
								county: 'county',
								country: 'england',
								postcode: 'bu23 ro3'
							}
						},
						CasePaymentMethod: {
							id: 'bacs',
							displayName: 'BACS'
						},
						paymentReference: 'ref'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildApplicantAgentDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/applicant-and-agent-details/applicant/organisation'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'applicant-and-agent-details': {
						applicantOrganisation: 'org',
						applicantFirstName: 'john',
						applicantLastName: 'burrows',
						applicantEmailAddress: 'email@john.com',
						applicantPhone: '0998888888',
						applicantAddress: {
							addressLine1: '38',
							addressLine2: 'john burrows way',
							townCity: 'harpenden',
							county: 'county',
							country: 'england',
							postcode: 'bu23 ro3'
						},
						isAgent: 'no',
						agentOrganisation: '',
						agentFirstName: '',
						agentLastName: '',
						agentEmailAddress: '',
						agentPhone: '',
						agentAddress: {
							addressLine1: '',
							addressLine2: '',
							townCity: '',
							county: '',
							country: '',
							postcode: ''
						},
						paymentMethod: 'bacs',
						paymentReference: 'ref'
					}
				}
			});
		});
		it('should prepopulate answers if previously answered with agent details provided', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						ApplicantDetails: {
							organisation: 'org',
							firstName: 'john',
							lastName: 'burrows',
							emailAddress: 'email@john.com',
							phone: '0998888888',
							Address: {
								addressLine1: '38',
								addressLine2: 'john burrows way',
								townCity: 'harpenden',
								county: 'county',
								country: 'england',
								postcode: 'bu23 ro3'
							}
						},
						AgentDetails: {
							organisation: 'agentorg',
							firstName: 'agent',
							lastName: 'agentburrows',
							emailAddress: 'agent@john.com',
							phone: '0998888888',
							Address: {
								addressLine1: '38',
								addressLine2: 'agent burrows way',
								townCity: 'agentland',
								county: 'county',
								country: 'england',
								postcode: 'bu23 ro3'
							}
						},
						CasePaymentMethod: {
							id: 'bacs',
							displayName: 'BACS'
						},
						paymentReference: 'ref'
					}))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildApplicantAgentDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/applicant-and-agent-details/applicant/organisation'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'applicant-and-agent-details': {
						applicantOrganisation: 'org',
						applicantFirstName: 'john',
						applicantLastName: 'burrows',
						applicantEmailAddress: 'email@john.com',
						applicantPhone: '0998888888',
						applicantAddress: {
							addressLine1: '38',
							addressLine2: 'john burrows way',
							townCity: 'harpenden',
							county: 'county',
							country: 'england',
							postcode: 'bu23 ro3'
						},
						isAgent: 'yes',
						agentOrganisation: 'agentorg',
						agentFirstName: 'agent',
						agentLastName: 'agentburrows',
						agentEmailAddress: 'agent@john.com',
						agentPhone: '0998888888',
						agentAddress: {
							addressLine1: '38',
							addressLine2: 'agent burrows way',
							townCity: 'agentland',
							county: 'county',
							country: 'england',
							postcode: 'bu23 ro3'
						},
						paymentMethod: 'bacs',
						paymentReference: 'ref'
					}
				}
			});
		});
		it('should populate no inputs if no previous answers present', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
						paymentReference: ''
					}))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildApplicantAgentDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/applicant-and-agent-details/applicant/organisation'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'applicant-and-agent-details': {
						applicantOrganisation: '',
						applicantFirstName: '',
						applicantLastName: '',
						applicantEmailAddress: '',
						applicantPhone: '',
						applicantAddress: {
							addressLine1: '',
							addressLine2: '',
							townCity: '',
							county: '',
							country: '',
							postcode: ''
						},
						isAgent: 'no',
						agentOrganisation: '',
						agentFirstName: '',
						agentLastName: '',
						agentEmailAddress: '',
						agentPhone: '',
						agentAddress: {
							addressLine1: '',
							addressLine2: '',
							townCity: '',
							county: '',
							country: '',
							postcode: ''
						},
						paymentMethod: '',
						paymentReference: ''
					}
				}
			});
		});
		it('should not skip populateForm if status is not-started and just prepopulate with blank values', async () => {
			const mockDb = {
				case: {
					findUnique: mock.fn(() => ({
						applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
					}))
				}
			};
			const mockReq = {
				baseUrl: '/applicant-and-agent-details',
				session: {
					caseReference: 'EN123456'
				}
			};
			const mockRes = {
				redirect: mock.fn()
			};

			const controller = buildApplicantAgentDetailsHomePage(
				{ db: mockDb },
				APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS
			);
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.redirect.mock.callCount(), 1);
			assert.strictEqual(
				mockRes.redirect.mock.calls[0].arguments[0],
				'/applicant-and-agent-details/applicant/organisation'
			);

			assert.deepStrictEqual(mockReq.session, {
				caseReference: 'EN123456',
				forms: {
					'applicant-and-agent-details': {
						applicantOrganisation: '',
						applicantFirstName: '',
						applicantLastName: '',
						applicantEmailAddress: '',
						applicantPhone: '',
						applicantAddress: {
							addressLine1: '',
							addressLine2: '',
							townCity: '',
							county: '',
							country: '',
							postcode: ''
						},
						isAgent: '',
						agentOrganisation: '',
						agentFirstName: '',
						agentLastName: '',
						agentEmailAddress: '',
						agentPhone: '',
						agentAddress: {
							addressLine1: '',
							addressLine2: '',
							townCity: '',
							county: '',
							country: '',
							postcode: ''
						},
						paymentMethod: '',
						paymentReference: ''
					}
				}
			});
		});
	});
});
