export interface DocumentRecord {
	id?: string;
	fileName: string;
	uploadedDate?: Date | string;
	size?: bigint | number;
	blobName: string;
	isCertified: boolean;
	SubCategory: DocumentSubCategoryCreateNestedOneWithoutDocumentInput;
	ApfpRegulation: ApfpRegulationCreateNestedOneWithoutDocumentInput;
	ScanResult: DocumentScanResultCreateNestedOneWithoutDocumentInput;
	Case: CaseCreateNestedOneWithoutDocumentsInput;
}
