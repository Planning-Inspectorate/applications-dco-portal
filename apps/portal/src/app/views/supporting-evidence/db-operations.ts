import { Prisma } from '@pins/dco-portal-database/src/client/index.js';
import type { CategoryInformation, SupportingEvidenceInput } from './types.d.ts';
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
