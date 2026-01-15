import type { AboutTheProjectInput, ProjectLinearSiteInput, ProjectSingleSiteInput } from './types.js';

export function mapAnswersToCase(answers: Record<string, any>): AboutTheProjectInput {
	return {
		projectDescription: answers.description,
		projectConsentReason: answers.consentReason,
		locationDescription: answers.locationDescription
	};
}

export function mapAnswersToSingleSite(answers: Record<string, any>): ProjectSingleSiteInput {
	return {
		easting: +answers.easting,
		northing: +answers.northing
	};
}

export function mapAnswersToLinearSite(answers: Record<string, any>): ProjectLinearSiteInput {
	return {
		startEasting: +answers.startEasting,
		startNorthing: +answers.startNorthing,
		middleEasting: +answers.middleEasting,
		middleNorthing: +answers.middleNorthing,
		endEasting: +answers.endEasting,
		endNorthing: +answers.endNorthing
	};
}
