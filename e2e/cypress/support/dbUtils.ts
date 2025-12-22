import { DOCUMENT_CATEGORY_STATUS_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { getPrisma } from './utils/dbClient';

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

	// restore case record to "not started"
	await prisma.case.update({
		where: { id: caseRecord.id },
		data: { [`${documentTypeId}StatusId`]: DOCUMENT_CATEGORY_STATUS_ID.NOT_STARTED }
	});

	// delete any uploaded documents
	await prisma.document.deleteMany({ where: { caseId } });

	console.log('Documents successfully cleared for document type: ', documentTypeId);
	return null;
};
