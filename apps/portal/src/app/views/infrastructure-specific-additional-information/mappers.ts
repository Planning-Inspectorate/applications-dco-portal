// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type { NonOffshoreGeneratingStationInput, OffshoreGeneratingStationInput } from './types.d.ts';

export function mapAnswersToNonOffshoreGeneratingStation(
	answers: Record<string, any>,
	caseId: string
): NonOffshoreGeneratingStationInput {
	return {
		electricityGrid: answers.electricityGrid,
		gasFuelledGeneratingStation: answers.gasFuelledGeneratingStation === BOOLEAN_OPTIONS.YES ? true : false,
		gasPipelineConnection: answers.gasPipelineConnection,
		caseId: caseId
	};
}

export function mapAnswersToOffshoreGeneratingStation(
	answers: Record<string, any>,
	caseId: string
): OffshoreGeneratingStationInput {
	return {
		cableInstallation: answers.cableInstallation,
		safetyZones: answers.safetyZones,
		caseId: caseId
	};
}
