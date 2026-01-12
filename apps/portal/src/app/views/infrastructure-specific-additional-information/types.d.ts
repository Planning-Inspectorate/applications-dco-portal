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
