import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function buildFileUploadHomePage({ db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const documentCategoryParam = req.params.documentCategory;

		const documentCategory = await db.documentCategory.findUnique({
			where: { id: documentCategoryParam }
		});

		return res.render('views/file-upload/view.njk', {
			pageTitle: documentCategory?.displayName,
			backLinkUrl: '/'
		});
	};
}
