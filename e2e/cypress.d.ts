/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable<Subject = any> {
		deleteDownloads(): Chainable<void>;
		deleteUnwantedFixtures(): Chainable<void>;
		validateDownloadedFile(fileName: string): Chainable<void>;
		getByData(value: string): Chainable<JQuery<HTMLElement>>;
	}
}
