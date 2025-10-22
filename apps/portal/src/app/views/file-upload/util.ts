import { DOCUMENT_CATEGORY, DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getDocumentCategoryDisplayName(documentCategoryId: string): string {
	return DOCUMENT_CATEGORY.find(({ id }) => id === documentCategoryId)?.displayName ?? '';
}

export function statusIdRadioButtonValue(statusId: string): string {
	const STATUS_ID_TO_RADIO_VALUE: Record<string, string> = {
		[DOCUMENT_CATEGORY_STATUS_ID.COMPLETED]: 'yes',
		[DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS]: 'no'
	};
	return STATUS_ID_TO_RADIO_VALUE[statusId] ?? '';
}
