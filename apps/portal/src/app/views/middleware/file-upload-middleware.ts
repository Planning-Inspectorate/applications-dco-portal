import type { Request, Response, NextFunction } from 'express';

export async function uploadDocumentQuestion(req: Request, res: Response, next: NextFunction) {
	const uploadDocumentQuestionUrls = ['upload-documents'];
	if (uploadDocumentQuestionUrls.includes(req.params.question)) {
		const { section } = req.params;
		const { journey } = res.locals;

		const sectionObj = journey.getSection(section);
		const questionObj = journey.getQuestionByParams(req.params);

		if (!questionObj || !sectionObj) {
			return res.redirect(journey.taskListUrl);
		}

		const hasSessionErrors = req.session?.errorSummary?.length > 0 || Object.keys(req.session?.errors || {}).length > 0;

		const viewModel = hasSessionErrors
			? questionObj.checkForValidationErrors(req, sectionObj, journey)
			: questionObj.prepQuestionForRendering(sectionObj, journey, {
					id: req.session.emailAddress,
					currentUrl: req.originalUrl,
					files: req.session?.files
				});

		if (req.session) {
			delete req.session.errors;
			delete req.session.errorSummary;
		}

		return questionObj.renderAction(res, viewModel);
	}
	next();
}
