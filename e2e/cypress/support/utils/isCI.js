/**
 * Checks whether Cypress is running in CI mode.
 *
 * Cypress may expose CLI environment values as booleans or strings depending on
 * how they were configured.
 *
 * @returns {boolean} True when CI mode is explicitly enabled.
 * @example
 * if (isCI()) {
 * 	// Apply CI-specific test behaviour.
 * }
 */
export function isCI() {
	const ciValue = Cypress.env('isCI');
	return ciValue === true || ciValue === 'true';
}
