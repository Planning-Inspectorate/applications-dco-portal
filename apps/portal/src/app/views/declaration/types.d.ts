import type { Prisma } from '@pins/dco-portal-database/src/client/client.ts';

export type CaseDataWithRequiredRelations = Prisma.CaseGetPayload<{
	include: {
		ApplicantDetails: {
			include: {
				Address: true;
			};
		};
		AgentDetails: {
			include: {
				Address: true;
			};
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

export type DocumentsWithCaseAndSubCategory = Prisma.DocumentGetPayload<{
	include: {
		Case: true;
		SubCategory: {
			include: {
				Category: true;
			};
		};
	};
}>;
