// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type {
	NonOffshoreGeneratingStationInput,
	OffshoreGeneratingStationInput,
	HighwayRelatedDevelopmentInput
} from './types.d.ts';

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

export function mapAnswersToHighwayRelatedDevelopment(
	answers: Record<string, any>,
	caseId: string
): HighwayRelatedDevelopmentInput {
	return {
		groundLevels: answers.groundLevels,
		bridgeHeights: answers.bridgeHeights,
		tunnelDepths: answers.tunnelDepths,
		tidalWaterLevels: answers.tidalWaterLevels,
		heightOfStructures: answers.heightOfStructures,
		drainageOutfallDetails: answers.drainageOutfallDetails,
		caseId: caseId
	};
}
