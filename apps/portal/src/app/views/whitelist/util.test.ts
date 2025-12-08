// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { addWhitelistErrors, shouldShowWarningBanner } from './util.ts';
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

describe('whitelist util', () => {
	describe('shouldShowWarningBanner', () => {
		it('should return true when emails match and admin user is changing access to standard', async () => {
			const mockReq = {
				session: {
					editUserEmailAddress: 'test@email.com',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.STANDARD_USER
						}
					}
				}
			};
			assert.strictEqual(shouldShowWarningBanner(mockReq, mockRes), true);
		});
		it('should return false when emails match and admin user but user is not changing access to standard', async () => {
			const mockReq = {
				session: {
					editUserEmailAddress: 'test@email.com',
					emailAddress: 'test@email.com'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.ADMIN_USER
						}
					}
				}
			};
			assert.strictEqual(shouldShowWarningBanner(mockReq, mockRes), false);
		});
		it('should return false when emails do not match', async () => {
			const mockReq = {
				session: {
					editUserEmailAddress: 'test@email.com',
					emailAddress: 'test-account@email.com'
				}
			};
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							accessLevel: WHITELIST_USER_ROLE_ID.STANDARD_USER
						}
					}
				}
			};
			assert.strictEqual(shouldShowWarningBanner(mockReq, mockRes), false);
		});
	});
	describe('addWhitelistErrors', () => {
		it('should populate and return errors and errorSummary if present in session', () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456',
					cases: {
						EN123456: {
							whitelistError: [
								{
									text: 'You are trying to add an admin user when there are already a maximum of 3',
									href: '#'
								}
							]
						}
					}
				}
			};
			assert.deepStrictEqual(addWhitelistErrors(mockReq), {
				errors: [
					{
						text: 'You are trying to add an admin user when there are already a maximum of 3',
						href: '#'
					}
				],
				errorSummary: [
					{
						text: 'You are trying to add an admin user when there are already a maximum of 3',
						href: '#'
					}
				]
			});
		});
		it('should return undefined if errors is empty', () => {
			const mockReq = {
				session: {
					caseReference: 'EN123456'
				}
			};
			assert.deepStrictEqual(addWhitelistErrors(mockReq), undefined);
		});
	});
});
