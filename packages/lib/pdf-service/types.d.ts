import { Prisma } from '@pins/dco-portal-database/src/client/client.ts';

export type FullCase = Prisma.CaseGetPayload<{
	include: {
		SupportingEvidence: {
			include: { Document: true };
		};
		ApplicantDetails: {
			include: { Address: true };
		};
		AgentDetails: {
			include: { Address: true };
		};
		CasePaymentMethod: true;
		ProjectSingleSite: true;
		ProjectLinearSite: true;
		NonOffshoreGeneratingStation: true;
		OffshoreGeneratingStation: true;
		HighwayRelatedDevelopment: true;
		RailwayDevelopment: true;
		HarbourFacilities: true;
		Pipelines: true;
		HazardousWasteFacility: true;
		DamOrReservoir: true;
	};
}>;

export type SupportingEvidenceWithDocument = Prisma.SupportingEvidenceGetPayload<{
	include: {
		Document: true;
	};
}>;

export interface PdfServiceConfig {
	url: string;
}
