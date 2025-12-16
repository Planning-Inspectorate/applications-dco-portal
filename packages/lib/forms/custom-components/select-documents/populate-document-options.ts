import type { PrismaClient } from '@pins/dco-portal-database/src/client/client.ts';
import type { Request } from 'express';

export async function populateDocumentOptions(
	req: Request,
	dbClient: PrismaClient,
	documentSubCategoryId: string | string[]
) {
	const caseData = await dbClient.case.findUnique({
		where: { reference: req.session?.caseReference },
		include: {
			Documents: {
				where: {
					SubCategory: {
						id: Array.isArray(documentSubCategoryId) ? { in: documentSubCategoryId } : documentSubCategoryId
					}
				}
			}
		}
	});

	if (!caseData || caseData.Documents.length === 0) {
		return [];
	}

	return caseData.Documents.map((document) => {
		const { id, fileName } = document;
		return {
			value: id,
			text: fileName
		};
	});
}
