export type SupportingEvidenceInput = Prisma.SupportingEvidenceUncheckedCreateInput;

export interface CategoryInformation {
	key: string;
	subCategoryId: string;
	applied?: boolean;
}

export interface MultipleCategoryInformation {
	key: string;
	subCategoryIds: string[];
}
