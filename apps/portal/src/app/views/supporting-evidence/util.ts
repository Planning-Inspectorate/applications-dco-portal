export function mapAnswersToInput(caseId: string, documentId: string, subCategoryId: string) {
	return {
		Case: {
			connect: {
				id: caseId
			}
		},
		Document: {
			connect: {
				id: documentId
			}
		},
		SubCategory: {
			connect: {
				id: subCategoryId
			}
		}
	};
}

export function getSupportingEvidenceIds(supportingEvidence: any[], subCategoryId: string): string {
	return supportingEvidence
		.filter((supportingEvidence) => supportingEvidence.subCategoryId === subCategoryId)
		.map((supportingEvidence) => supportingEvidence.documentId)
		.join(',');
}

export function getMultiSubcategorySupportingEvidenceIds(supportingEvidence: any[], subCategoryIds: string[]): string {
	return supportingEvidence
		.filter((supportingEvidence) => subCategoryIds.includes(supportingEvidence.subCategoryId))
		.map((supportingEvidence) => supportingEvidence.documentId)
		.join(',');
}
