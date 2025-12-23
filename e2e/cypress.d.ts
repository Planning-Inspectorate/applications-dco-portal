/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		deleteDownloads(): Chainable<void>;
		validateDownloadedFile(fileName: string): Chainable<void>;
		getByData(value: string): Chainable<JQuery<HTMLElement>>;
		testLogin(emailAddress: string, caseReference: string): Chainable<void>;
		loginSession(): Chainable<void>;
	}
}
