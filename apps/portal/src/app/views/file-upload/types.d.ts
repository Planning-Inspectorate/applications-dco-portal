export interface DocumentRecord {
	id?: string;
	fileName: string;
	uploadedDate?: Date | string;
	size?: bigint | number;
	blobName: string;
	mimeType: string;
	isCertified: boolean;
	uploaderEmail: string;
	SubCategory: DocumentSubCategoryCreateNestedOneWithoutDocumentInput;
	ApfpRegulation: ApfpRegulationCreateNestedOneWithoutDocumentInput;
	ScanResult: DocumentScanResultCreateNestedOneWithoutDocumentInput;
	Case: CaseCreateNestedOneWithoutDocumentsInput;
}
