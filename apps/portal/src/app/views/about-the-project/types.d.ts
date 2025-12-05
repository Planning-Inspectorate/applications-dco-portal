export interface AboutTheProjectInput {
	projectDescription: string;
	projectConsentReason: string;
}

export interface ProjectSingleSiteInput {
	easting: number;
	northing: number;
}

export interface ProjectLinearSiteInput {
	startEasting: number;
	startNorthing: number;
	middleEasting: number;
	middleNorthing: number;
	endEasting: number;
	endNorthing: number;
}
