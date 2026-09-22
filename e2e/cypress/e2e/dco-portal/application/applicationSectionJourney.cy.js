/// <reference types="cypress" />
import CommonActions from '../../../page_object/PageAction/commonActions.js';
import { APPLICATION_SECTIONS } from '../../../support/utils/applicationSectionTestData.js';

/**
 * Verifies that each "Your application" section on the home-page task list is
 * accessible after login and renders its check-your-answers summary page.
 *
 * These are the dynamic-forms sections (not file-upload categories).
 * Each section exposes a /check-your-answers route with a standard GDS heading.
 */
const applicationSectionAccessTests = ({ name, fragment }) => {
	describe(name, () => {
		it(`is accessible and shows the check-your-answers page for ${name}`, () => {
			CommonActions.login();

			// Navigate directly to the check-your-answers page — no journey state is
			// required to load this view (it renders whatever answers are in the session).
			cy.visit(`${fragment}/check-your-answers`);

			cy.url().should('include', `${fragment}/check-your-answers`);
			cy.get('h1').should('be.visible').and('contain.text', 'Check your answers');
		});
	});
};

describe('Application section accessibility', () => {
	APPLICATION_SECTIONS.forEach(applicationSectionAccessTests);
});
