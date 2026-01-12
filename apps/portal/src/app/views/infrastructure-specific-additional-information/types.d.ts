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
