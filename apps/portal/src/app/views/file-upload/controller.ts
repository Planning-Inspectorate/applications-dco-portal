import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildFileUploadHomePage({ db }: PortalService, documentTypeId: string): AsyncRequestHandler {
	return async (req, res) => {
		const documentCategory = await db.documentCategory.findUnique({
			where: { id: documentTypeId }
		});

		const caseWithFilteredDocuments = await db.case.findFirst({
			where: { reference: req.session.caseReference },
			include: {
				Documents: {
					where: {
						SubCategory: {
							Category: {
								id: documentTypeId
							}
						}
					},
					include: {
						SubCategory: {
							include: {
								Category: true
							}
						}
					}
				}
			}
		});

		return res.render('views/file-upload/view.njk', {
			pageTitle: documentCategory?.displayName,
			documents: caseWithFilteredDocuments?.Documents || [],
			uploadButtonUrl: `${req.baseUrl}/upload/document-type`,
			backLinkUrl: '/'
		});
	};
}
