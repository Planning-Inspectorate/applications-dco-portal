/**
 * @file Database and Azure Blob Storage utility functions for test setup and cleanup.
 * @module support/dbUtils
 *
 * This module provides Node task functions to reset test data directly in the database.
 * It also removes test files from Azure Blob Storage.
 */

import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { BlobServiceClient } from '@azure/storage-blob';
import { getPrisma } from './utils/dbClient';

/**
 * Maps document category URL fragments to their database status column names.
 */
const CATEGORY_MAP: Record<string, string> = {
	'application-form-related-information': 'applicationFormRelatedInformationStatusId',
	'plans-and-drawings': 'plansAndDrawingsStatusId',
	'draft-dco': 'draftDcoStatusId',
	'compulsory-acquisition-information': 'compulsoryAcquisitionInformationStatusId',
	'newspaper-notices': 'newspaperNoticesStatusId',
	'reports-and-statements': 'reportsAndStatementsStatusId',
	'environmental-statement': 'environmentalStatementStatusId',
	'additional-prescribed-information': 'additionalPrescribedInformationStatusId',
	'other-documents': 'otherDocumentsStatusId'
};

/**
 * Clears uploaded documents, supporting evidence, and storage blobs for a document category.
 * Resets the status of the category on the case to NOT_STARTED.
 *
 * @param {object} options - The target case and category details.
 * @param {string} options.documentTypeId - The URL fragment identifying the document category.
 * @param {string} options.reference - The unique reference code of the case.
 * @returns {Promise<null>} Always returns null to satisfy the Cypress task interface.
 */
export const clearDocumentCategory = async (options: { documentTypeId: string; reference: string }) => {
	const prisma = getPrisma();
	const { documentTypeId, reference } = options;

	const caseRecord = await prisma.case.findUnique({
		where: { reference }
	});

	if (!caseRecord) {
		throw new Error(`Case not found for reference: ${reference}`);
	}

	const caseId = caseRecord.id;
	const statusField = CATEGORY_MAP[documentTypeId] || `${documentTypeId}StatusId`;

	// Restore category status to not started
	await prisma.case.update({
		where: { id: caseRecord.id },
		data: { [statusField]: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED }
	});

	// Delete documents and supporting evidence to satisfy foreign keys
	await prisma.supportingEvidence.deleteMany({ where: { caseId } });
	await prisma.document.deleteMany({ where: { caseId } });

	// Purge Azure blob storage files for this category
	const connectionString = process.env.BLOB_STORE_CONNECTION_STRING;
	const containerName = process.env.BLOB_STORE_CONTAINER || 'dco-portal-documents';

	if (connectionString) {
		try {
			const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
			const containerClient = blobServiceClient.getContainerClient(containerName);
			if (await containerClient.exists()) {
				const prefix = `${reference}/${documentTypeId}/`;
				for await (const blob of containerClient.listBlobsFlat({ prefix })) {
					await containerClient.deleteBlob(blob.name);
				}
			}
		} catch (err) {
			console.warn(`Could not clear blobs for prefix ${reference}/${documentTypeId}/:`, err);
		}
	}

	console.log('Documents successfully cleared for document type: ', documentTypeId);
	return null;
};

/**
 * Deletes a whitelisted test user from the database by email and case reference.
 *
 * @param {object} options - The deletion options.
 * @param {string} options.email - The email address of the user to remove.
 * @param {string} options.reference - The case reference code.
 * @returns {Promise<null>} Always returns null to satisfy the Cypress task interface.
 */
export const deleteWhitelistUser = async (options: { email: string; reference: string }) => {
	const prisma = getPrisma();
	const { email, reference } = options;

	await prisma.whitelistUser.deleteMany({
		where: {
			caseReference: reference,
			email
		}
	});
	return null;
};

/**
 * Sets all document categories on a case to COMPLETED to prepare for submission testing.
 * Sets the anticipated date of submission to today.
 *
 * @param {object} options - The case options.
 * @param {string} options.reference - The case reference code.
 * @returns {Promise<null>} Always returns null to satisfy the Cypress task interface.
 */
export const setupCaseForSubmission = async (options: { reference: string }) => {
	const prisma = getPrisma();
	const { reference } = options;

	const caseRecord = await prisma.case.findUnique({ where: { reference } });
	if (!caseRecord) {
		throw new Error(`Case not found for reference: ${reference}`);
	}

	const today = new Date();
	await prisma.case.update({
		where: { id: caseRecord.id },
		data: {
			anticipatedDateOfSubmission: today,
			applicationFormRelatedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			plansAndDrawingsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			draftDcoStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			compulsoryAcquisitionInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			newspaperNoticesStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			reportsAndStatementsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			environmentalStatementStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			additionalPrescribedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			otherDocumentsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED,
			aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.COMPLETED
		}
	});

	return null;
};

/**
 * Resets a case completely back to the unstarted initial state.
 * Deletes all documents, clears supporting evidence, resets category statuses, and purges all storage blobs.
 *
 * @param {object} options - The case reset options.
 * @param {string} options.reference - The case reference code.
 * @returns {Promise<null>} Always returns null to satisfy the Cypress task interface.
 */
export const resetCase = async (options: { reference: string }) => {
	const prisma = getPrisma();
	const { reference } = options;

	const caseRecord = await prisma.case.findUnique({ where: { reference } });
	if (caseRecord) {
		const caseId = caseRecord.id;

		// 1. Delete all SupportingEvidence and Document records
		await prisma.supportingEvidence.deleteMany({ where: { caseId } });
		await prisma.document.deleteMany({ where: { caseId } });

		// 2. Reset all case fields to not-started and null submission dates
		await prisma.case.update({
			where: { id: caseRecord.id },
			data: {
				submissionDate: null,
				anticipatedDateOfSubmission: null,
				applicationFormRelatedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				plansAndDrawingsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				draftDcoStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				compulsoryAcquisitionInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				newspaperNoticesStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				reportsAndStatementsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				environmentalStatementStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				additionalPrescribedInformationStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				otherDocumentsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				applicantAndAgentDetailsStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED,
				aboutTheProjectStatusId: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED
			}
		});

		// 3. Purge all blobs in container for this reference
		const connectionString = process.env.BLOB_STORE_CONNECTION_STRING;
		const containerName = process.env.BLOB_STORE_CONTAINER || 'dco-portal-documents';
		if (connectionString) {
			try {
				const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
				const containerClient = blobServiceClient.getContainerClient(containerName);
				if (await containerClient.exists()) {
					const prefix = `${reference}/`;
					for await (const blob of containerClient.listBlobsFlat({ prefix })) {
						await containerClient.deleteBlob(blob.name);
					}
				}
			} catch (err) {
				console.warn(`Could not clear blobs for reference ${reference}:`, err);
			}
		}
	}
	return null;
};
