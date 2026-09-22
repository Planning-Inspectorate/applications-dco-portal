import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { initBlobStore } from '@pins/dco-portal-lib/blob-store/index.ts';
import { initLogger } from '@pins/dco-portal-lib/util/logger.ts';
import { getPrisma } from './utils/dbClient';
import { formatAsCamelCase } from './utils/format.js';

/**
 * Removes all persisted state for one document category in the E2E case.
 *
 * Database documents and supporting-evidence links are removed first. Blob
 * storage is then cleared using the same case/category prefix used by upload
 * duplicate detection, which also removes uploads that were never committed
 * to the database.
 *
 * @param options - The E2E case and document category to clear.
 * @param options.documentTypeId - The document category identifier.
 * @param options.reference - The application reference for the E2E case.
 * @returns {Promise<null>} Resolves when database and blob cleanup completes.
 * @throws {Error} If the requested E2E case does not exist.
 */
export const clearDocumentCategory = async (options: { documentTypeId: string; reference: string }) => {
	const prisma = getPrisma();
	const logger = initLogger({ logLevel: 'info', NODE_ENV: 'test' });
	const blobStore = initBlobStore(
		{
			disabled: process.env.BLOB_STORE_DISABLED === 'true',
			host: process.env.BLOB_STORE_HOST || '',
			container: process.env.BLOB_STORE_CONTAINER || '',
			connectionString: process.env.BLOB_STORE_CONNECTION_STRING || ''
		},
		logger
	);

	const { documentTypeId, reference } = options;

	const caseRecord = await prisma.case.findUnique({
		where: { reference }
	});

	if (!caseRecord) {
		throw new Error(`Case not found for reference: ${reference}`);
	}

	const documents = await prisma.document.findMany({
		where: {
			caseId: caseRecord.id,
			SubCategory: {
				Category: { id: documentTypeId }
			}
		},
		select: { id: true }
	});

	const documentIds = documents.map(({ id }) => id);

	await prisma.$transaction([
		prisma.supportingEvidence.deleteMany({
			where: { documentId: { in: documentIds } }
		}),
		prisma.document.deleteMany({
			where: {
				id: { in: documentIds }
			}
		}),
		prisma.case.update({
			where: { id: caseRecord.id },
			// Prisma fields are camelCase, but documentTypeId is the kebab-case route fragment.
			data: { [`${formatAsCamelCase(documentTypeId)}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED }
		})
	]);

	let deletedBlobCount = 0;
	if (blobStore) {
		const blobPrefix = `${reference}/${documentTypeId}/`;
		const blobs = await blobStore.getContainerContents(blobPrefix);
		deletedBlobCount = blobs.length;
		await Promise.all(blobs.map(({ name }) => blobStore.deleteBlobIfExists(name)));
	}

	logger.info({ documentTypeId, reference, deletedBlobCount }, 'Document category cleared');
	return null;
};
