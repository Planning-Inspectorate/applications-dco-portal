import { Prisma } from '@prisma/client';
import type { CategoryInformation, SupportingEvidenceInput } from './types.d.ts';

export async function saveSupportingEvidence(
	$tx: Prisma.TransactionClient,
	caseId: string,
	documentId: string,
	subCategoryId: string
): Promise<void> {
	const input: SupportingEvidenceInput = mapAnswersToInput(caseId, documentId, subCategoryId);
	await $tx.supportingEvidence.upsert({
		where: {
			caseId_documentId_subCategoryId: {
				caseId,
				documentId,
				subCategoryId
			}
		},
		create: input,
		update: {}
	});
}

export async function deleteSubCategorySupportingEvidence(
	$tx: Prisma.TransactionClient,
	caseId: string,
	categories: CategoryInformation[]
): Promise<void> {
	await $tx.supportingEvidence.deleteMany({
		where: {
			caseId,
			subCategoryId: { in: categories.map((c) => c.subCategoryId) }
		}
	});
}

function mapAnswersToInput(caseId: string, documentId: string, subCategoryId: string) {
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
