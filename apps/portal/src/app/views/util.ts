import { DOCUMENT_CATEGORY, DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION } from './constants.ts';

export function getDocumentCategoryDisplayName(documentCategoryId: string): string {
	return DOCUMENT_CATEGORY.find(({ id }) => id === documentCategoryId)?.displayName ?? '';
}

export function getApplicationSectionDisplayName(applicationSectionId: string): string {
	return APPLICATION_SECTION.find(({ id }) => id === applicationSectionId)?.displayName ?? '';
}

export function statusIdRadioButtonValue(statusId: string): string {
	const STATUS_ID_TO_RADIO_VALUE: Record<string, string> = {
		[DOCUMENT_CATEGORY_STATUS_ID.COMPLETED]: 'yes',
		[DOCUMENT_CATEGORY_STATUS_ID.IN_PROGRESS]: 'no'
	};
	return STATUS_ID_TO_RADIO_VALUE[statusId] ?? '';
}

export function populateMultiSubcategoryCheckboxes(subCategories: { count: number; id: string }[]) {
	let value = '';
	for (const cat of subCategories) {
		if (cat.count > 0) value += `${cat.id},`;
	}
	return value.length ? value.slice(0, -1) : value;
}
