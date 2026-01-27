import type { CaseDataWithRequiredRelations, DocumentsWithCaseAndSubCategory } from './types.d.ts';

export function mapCaseDataToBackOfficeFormat(
	caseData: CaseDataWithRequiredRelations,
	submissionDate: Date,
	positionInOrganisation: string
) {
	return {
		case: {
			reference: caseData.reference,
			description: caseData.projectDescription,
			applicant: {
				lastName: caseData.ApplicantDetails?.lastName,
				phoneNumber: caseData.ApplicantDetails?.phone,
				email: caseData.ApplicantDetails?.emailAddress,
				organisationName: caseData.ApplicantDetails?.organisation,
				jobTitle: positionInOrganisation,
				Address: {
					addressLine1: caseData.ApplicantDetails?.Address?.addressLine1,
					addressLine2: caseData.ApplicantDetails?.Address?.addressLine2,
					town: caseData.ApplicantDetails?.Address?.townCity,
					county: caseData.ApplicantDetails?.Address?.county,
					country: caseData.ApplicantDetails?.Address?.country,
					postcode: caseData.ApplicantDetails?.Address?.postcode
				}
			},
			agent: {
				// TODO: check how agent should be passed to CBOS - is it in the representation model?
				lastName: caseData.AgentDetails?.lastName,
				phoneNumber: caseData.AgentDetails?.phone,
				email: caseData.AgentDetails?.emailAddress,
				organisationName: caseData.AgentDetails?.organisation,
				Address: {
					addressLine1: caseData.AgentDetails?.Address?.addressLine1,
					addressLine2: caseData.AgentDetails?.Address?.addressLine2,
					town: caseData.AgentDetails?.Address?.townCity,
					county: caseData.AgentDetails?.Address?.county,
					country: caseData.AgentDetails?.Address?.country,
					postcode: caseData.AgentDetails?.Address?.postcode
				}
			},
			ApplicationDetails: {
				locationDescription: caseData.locationDescription,
				submissionAtInternal: submissionDate
			},
			gridReference: {
				//TODO: check how to handle linear sites as CBOS only accepts a single northing and easting.
				northing: caseData.ProjectSingleSite?.northing || caseData.ProjectLinearSite?.startNorthing,
				easting: caseData.ProjectSingleSite?.easting || caseData.ProjectLinearSite?.startEasting
			}
		}
	};
}

export function mapDocumentsToBackOfficeFormat(documents: DocumentsWithCaseAndSubCategory[]) {
	return documents.map((document) => ({
		documentName: document.fileName,
		documentSize: document.size,
		documentType: document.mimeType,
		blobStoreUrl: document.blobName,
		caseId: document.Case.id,
		folderName: document.SubCategory.Category.displayName,
		documentReference: document.SubCategory.displayName,
		username: document.uploaderEmail
	}));
}
