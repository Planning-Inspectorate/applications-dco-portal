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

Cypress.on('uncaught:exception', () => false);
