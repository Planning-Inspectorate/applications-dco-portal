import { Prisma } from '@pins/dco-portal-database/src/client/client.ts';
import type { CategoryInformation, MultipleCategoryInformation, SupportingEvidenceInput } from './types.d.ts';
import { mapAnswersToInput } from './util.ts';

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

export async function deleteMultipleSubCategorySupportingEvidence(
	$tx: Prisma.TransactionClient,
	caseId: string,
	categories: MultipleCategoryInformation[]
): Promise<void> {
	await $tx.supportingEvidence.deleteMany({
		where: {
			caseId,
			subCategoryId: {
				in: categories.reduce((acc: string[], cur) => {
					return [...acc, ...cur.subCategoryIds];
				}, [])
			}
		}
	});
}
