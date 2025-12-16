import type { Request, Response, NextFunction } from 'express';
import { DOCUMENT_SUB_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { populateDocumentOptions } from '@pins/dco-portal-lib/forms/custom-components/select-documents/populate-document-options.ts';
import { PortalService } from '#service';

export function selectDocumentQuestionMiddleware({ db }: PortalService) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { section, question } = req.params;
		if ((Object.values(DOCUMENT_SUB_CATEGORY_ID) as string[]).includes(question)) {
			const { journey } = res.locals;

			const sectionObj = journey.getSection(section);
			const questionObj = journey.getQuestionBySectionAndName(section, question);

			if (!questionObj || !sectionObj) {
				return res.redirect(journey.taskListUrl);
			}
			const documentOptions = await populateDocumentOptions(req, db, question);
			questionObj.setOptions(documentOptions);
		}
		next();
	};
}

export function selectMultipleDocumentQuestionMiddleware({ db }: PortalService, documentSubCategoryIds: string[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const { section, question } = req.params;
		const subCategories = documentSubCategoryIds.filter((id) =>
			(Object.values(DOCUMENT_SUB_CATEGORY_ID) as string[]).includes(id)
		);
		if (subCategories.length) {
			const { journey } = res.locals;

			const sectionObj = journey.getSection(section);
			const questionObj = journey.getQuestionBySectionAndName(section, question);

			if (!questionObj || !sectionObj) {
				return res.redirect(journey.taskListUrl);
			}
			const documentOptions = await populateDocumentOptions(req, db, subCategories);
			questionObj.setOptions(documentOptions);
		}
		next();
	};
}
