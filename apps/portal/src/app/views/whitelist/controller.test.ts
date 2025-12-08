// @ts-nocheck

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { buildWhitelistHomePage } from './controller.ts';

describe('whitelist controller', () => {
	describe('buildWhitelistHomePage', () => {
		it('should render white list home page with view data and user list', async () => {
			const mockDb = {
				whitelistUser: {
					findMany: mock.fn(() => [
						{
							id: 'user-4',
							email: 'test@email.com',
							UserRole: {
								displayName: 'Standard'
							}
						},
						{
							id: 'user-3',
							email: 'bob@email.com',
							UserRole: {
								displayName: 'Admin'
							}
						},
						{
							id: 'user-1',
							email: 'neil@email.com',
							isInitialInvitee: true,
							UserRole: {
								displayName: 'Admin'
							}
						}
					])
				}
			};

			const mockReq = {
				baseUrl: '/manage-users',
				session: {
					emailAddress: 'test@email.com',
					caseReference: 'EN123456',
					cases: {
						EN123456: {
							whitelistUpdateMessage: 'update message'
						}
					}
				}
			};
			const mockRes = {
				render: mock.fn()
			};

			const controller = buildWhitelistHomePage({ db: mockDb });
			await controller(mockReq, mockRes);

			assert.strictEqual(mockRes.render.mock.callCount(), 1);
			assert.strictEqual(mockRes.render.mock.calls[0].arguments[0], 'views/whitelist/view.njk');
			assert.deepStrictEqual(mockRes.render.mock.calls[0].arguments[1], {
				pageTitle: 'Manage users of this project',
				backLinkUrl: '/',
				addUserLink: `/manage-users/add-user/user/email-address`,
				whitelistUpdateMessage: 'update message',
				users: [
					[
						{ text: 'test@email.com' },
						{ text: 'Standard' },
						{
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/manage-users/user-4/edit-user/user/access-level">Edit</a>'
						},
						{
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/manage-users/user-4/remove-user">Remove</a>'
						}
					],
					[
						{ text: 'bob@email.com' },
						{ text: 'Admin' },
						{
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/manage-users/user-3/edit-user/user/access-level">Edit</a>'
						},
						{
							html: '<a class="govuk-link govuk-link--no-visited-state" href="/manage-users/user-3/remove-user">Remove</a>'
						}
					],
					[{ text: 'neil@email.com' }, { text: 'Admin' }, { html: '' }, { html: '' }]
				]
			});
		});
		it('should render not found page if email and case reference missing from session data', async () => {
			const mockReq = {
				session: {}
			};
			const mockRes = {
				render: mock.fn(),
				status: mock.fn()
			};

			const controller = buildWhitelistHomePage({});
			await controller(mockReq, mockRes);

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
