/**
 * @file Global Cypress support configuration and runtime hooks.
 * @module support/e2e
 *
 * This file runs before every Cypress test suite.
 * It registers custom commands and handles form target resolution.
 */

/// <reference types="cypress"/>

import './commands';
import * as grep from '@cypress/grep';

const registerGrep = grep.register ?? grep.default;
if (typeof registerGrep === 'function') {
	registerGrep();
}

/**
 * Clears session storage and browser cookies after all tests in a spec file complete.
 */
after(() => {
	cy.clearAllSessionStorage();
	cy.clearCookies();
});

/**
 * Normalizes the action attribute of the enclosing form to match the current URL.
 *
 * GOV.UK Frontend templates use empty action attributes to submit to the active route.
 * Cypress injects a base tag into the test iframe.
 * That tag forces empty action attributes to submit to the root path.
 * This function points the form action back to the active page URL before submission.
 *
 * @param {HTMLElement} [element] - The DOM element that triggered the form submission.
 * @returns {void}
 */
function normalizeFormAction(element) {
	if (!element) return;

	const form = element.tagName === 'FORM' ? element : element.closest?.('form') || element.form;
	const win = element.ownerDocument?.defaultView;

	if (!form || !win || win.location.pathname === '/') return;

	win.document.querySelector('base')?.remove();

	const action = form.getAttribute('action');
	const rootTargets = ['', '/', '#', win.location.origin, `${win.location.origin}/`];
	const isRootOrEmpty = !action || rootTargets.includes(action) || rootTargets.includes(form.action);

	if (isRootOrEmpty) {
		form.action = win.location.href;
		form.setAttribute('action', win.location.href);
	}
}

// Intercept Cypress commands before DOM dispatch
Cypress.Commands.overwrite('click', (originalClick, subject, ...args) => {
	normalizeFormAction(subject?.[0]);
	return originalClick(subject, ...args);
});

Cypress.Commands.overwrite('submit', (originalSubmit, subject, ...args) => {
	normalizeFormAction(subject?.[0]);
	return originalSubmit(subject, ...args);
});

// Capture native form submissions (for example pressing Enter in an input field)
Cypress.on('window:before:load', (win) => {
	win.addEventListener('submit', (event) => normalizeFormAction(event.target), true);
});

// Suppress unhandled exceptions from failing tests
Cypress.on('uncaught:exception', () => false);
