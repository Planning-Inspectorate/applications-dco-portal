// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type {
	NonOffshoreGeneratingStationInput,
	OffshoreGeneratingStationInput,
	HighwayRelatedDevelopmentInput,
	RailwayDevelopmentInput,
	HarbourFacilitiesInput,
	PipelinesInput
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
		groundLevels: answers.highwayGroundLevels,
		bridgeHeights: answers.highwayBridgeHeights,
		tunnelDepths: answers.highwayTunnelDepths,
		tidalWaterLevels: answers.highwayTidalWaterLevels,
		heightOfStructures: answers.highwayHeightOfStructures,
		drainageOutfallDetails: answers.highwayDrainageOutfallDetails,
		caseId: caseId
	};
}

export function mapAnswersToRailwayDevelopment(answers: Record<string, any>, caseId: string): RailwayDevelopmentInput {
	return {
		groundLevels: answers.railwayGroundLevels,
		bridgeHeights: answers.railwayBridgeHeights,
		tunnelDepths: answers.railwayTunnelDepths,
		tidalWaterLevels: answers.railwayTidalWaterLevels,
		heightOfStructures: answers.railwayHeightOfStructures,
		drainageOutfallDetails: answers.railwayDrainageOutfallDetails,
		caseId: caseId
	};
}

export function mapAnswersToHarbourFacilities(answers: Record<string, any>, caseId: string): HarbourFacilitiesInput {
	return {
		whyHarbourOrderNeeded: answers.whyHarbourOrderNeeded,
		benefitsToSeaTransport: answers.benefitsToSeaTransport,
		caseId: caseId
	};
}

export function mapAnswersToPipelines(answers: Record<string, any>, caseId: string): PipelinesInput {
	return {
		name: answers.pipelineName,
		owner: answers.pipelineOwner,
		startPoint: answers.pipelineStartPoint,
		endPoint: answers.pipelineEndPoint,
		length: +answers.pipelineLength,
		externalDiameter: +answers.pipelineExternalDiameter,
		conveyance: answers.pipelineConveyance,
		landRightsCrossingConsents: answers.landRightsCrossingConsents === BOOLEAN_OPTIONS.YES ? true : false,
		landRightsCrossingConsentsAgreement:
			answers.landRightsCrossingConsents === BOOLEAN_OPTIONS.YES ? answers.landRightsCrossingConsentsAgreement : null,
		caseId: caseId
	};
}
