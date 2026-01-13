export interface NonOffshoreGeneratingStationInput {
	electricityGrid: string;
	gasFuelledGeneratingStation: boolean;
	gasPipelineConnection: string;
	caseId: string;
}

export interface OffshoreGeneratingStationInput {
	cableInstallation: string;
	safetyZones: string;
	caseId: string;
}

export interface HighwayRelatedDevelopmentInput {
	groundLevels: string;
	bridgeHeights: string;
	tunnelDepths: string;
	tidalWaterLevels: string;
	heightOfStructures: string;
	drainageOutfallDetails: string;
	caseId: string;
}

export interface RailwayDevelopmentInput {
	groundLevels: string;
	bridgeHeights: string;
	tunnelDepths: string;
	tidalWaterLevels: string;
	heightOfStructures: string;
	drainageOutfallDetails: string;
	caseId: string;
}

export interface HarbourFacilitiesInput {
	whyHarbourOrderNeeded: string;
	benefitsToSeaTransport: string;
	caseId: string;
}

export interface PipelinesInput {
	name: string;
	owner: string;
	startPoint: string;
	endPoint: string;
	length: number;
	externalDiameter: number;
	conveyance: string;
	landRightsCrossingConsents: boolean;
	landRightsCrossingConsentsAgreement: string;
	caseId: string;
}

export interface HazardousWasteFacilityInput {
	whyIsFacilityNeeded: string;
	annualCapacity: string;
	caseId: string;
}

export interface DamOrReservoirInput {
	recreationalAmenities: string;
	recreationalAmenitiesDescription: string;
	caseId: string;
}
