import { DOCUMENT_CATEGORY_ID, DOCUMENT_SUB_CATEGORY } from '@pins/dco-portal-database/src/seed/data-static.ts';

export function getInfrastructureSpecificAdditionalInformationSubcategoryOptions(): {
	id: string;
	displayName: string;
	categoryId: string;
}[] {
	const ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_OPTIONS = DOCUMENT_SUB_CATEGORY.filter(
		(cat) => cat.categoryId === DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION
	);
	if (!ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_OPTIONS.length) {
		throw new Error('No additional information subcategories found.');
	}
	return ADDITIONAL_INFORMATION_DOCUMENTS_SUBCATEGORY_OPTIONS;
}
