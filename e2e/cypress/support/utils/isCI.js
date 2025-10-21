function isCI() {
	return Cypress.env('isCI');
}

export { isCI };
