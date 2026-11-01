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

const patchFormsInWindow = (win) => {
	if (!win || !win.document) return;
	win.document.querySelectorAll('base').forEach((b) => b.remove());

	const currentUrl = win.location.href;
	const pathname = win.location.pathname;
	if (pathname && pathname !== '/') {
		win.document.querySelectorAll('form').forEach((form) => {
			const attr = form.getAttribute('action');
			const prop = form.action;
			const isRootOrEmpty =
				!attr ||
				attr === '' ||
				attr === '/' ||
				attr === '#' ||
				attr === win.location.origin ||
				attr === win.location.origin + '/' ||
				prop === win.location.origin ||
				prop === win.location.origin + '/';

			if (isRootOrEmpty) {
				form.setAttribute('action', currentUrl);
				form.action = currentUrl;
			}
		});
	}
};

const setupWindow = (win) => {
	patchFormsInWindow(win);

	if (win.MutationObserver && win.document && win.document.documentElement) {
		const observer = new win.MutationObserver(() => {
			patchFormsInWindow(win);
		});
		observer.observe(win.document.documentElement, { childList: true, subtree: true });
	}

	win.addEventListener(
		'click',
		(e) => {
			const target = e.target;
			if (target && target instanceof win.HTMLElement) {
				const form = target.closest('form');
				if (form && win.location.pathname !== '/') {
					patchFormsInWindow(win);
					form.setAttribute('action', win.location.href);
					form.action = win.location.href;
				}
			}
		},
		true
	);

	win.addEventListener(
		'submit',
		(e) => {
			const form = e.target;
			if (form && form instanceof win.HTMLFormElement && win.location.pathname !== '/') {
				patchFormsInWindow(win);
				form.setAttribute('action', win.location.href);
				form.action = win.location.href;
			}
		},
		true
	);
};

Cypress.on('window:before:load', (win) => {
	setupWindow(win);
});

Cypress.on('window:load', (win) => {
	setupWindow(win);
});

Cypress.Commands.overwrite('click', (originalFn, subject, ...args) => {
	if (subject && subject[0]) {
		const el = subject[0];
		const form = el.closest ? el.closest('form') : el.form || null;
		if (form && el.ownerDocument && el.ownerDocument.defaultView) {
			const win = el.ownerDocument.defaultView;
			patchFormsInWindow(win);
			if (win.location.pathname !== '/') {
				form.setAttribute('action', win.location.href);
				form.action = win.location.href;
			}
		}
	}
	return originalFn(subject, ...args);
});

Cypress.Commands.overwrite('submit', (originalFn, subject, ...args) => {
	if (subject && subject[0]) {
		const el = subject[0];
		const form = el.tagName === 'FORM' ? el : el.closest ? el.closest('form') : null;
		if (form && form.ownerDocument && form.ownerDocument.defaultView) {
			const win = form.ownerDocument.defaultView;
			patchFormsInWindow(win);
			if (win.location.pathname !== '/') {
				form.setAttribute('action', win.location.href);
				form.action = win.location.href;
			}
		}
	}
	return originalFn(subject, ...args);
});

Cypress.on('uncaught:exception', () => false);
