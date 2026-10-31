/// <reference types="cypress"/>

import './commands';
import * as grep from '@cypress/grep';

const register = grep.register ?? grep.default;

if (typeof register !== 'function') {
	throw new Error(`@cypress/grep register function not found. Exports: ${Object.keys(grep).join(', ')}`);
}

register();

after(() => {
	cy.clearAllSessionStorage();
	cy.clearCookies();
});

Cypress.on('window:load', (win) => {
	win.document.querySelectorAll('base').forEach((b) => b.remove());

	const patchFormActions = () => {
		const path = win.location.pathname + (win.location.search || '');
		if (path && path !== '/') {
			win.document.querySelectorAll('form').forEach((form) => {
				const action = form.getAttribute('action');
				if (!action || action === '' || action === '/' || action === '#') {
					form.setAttribute('action', path);
					form.action = path;
				}
			});
		}
	};
	patchFormActions();
	win.addEventListener(
		'submit',
		(e) => {
			if (e.target instanceof win.HTMLFormElement) {
				patchFormActions();
			}
		},
		true
	);
});

Cypress.on('uncaught:exception', () => false);
