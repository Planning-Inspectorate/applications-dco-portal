import { DOCUMENT_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getDocumentCategoryDisplayName(documentCategoryId: string): string {
	return DOCUMENT_CATEGORY.find(({ id }) => id === documentCategoryId)?.displayName ?? '';
}
