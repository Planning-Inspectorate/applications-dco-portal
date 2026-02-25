import { PdfService } from '#service';
import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { postGeneratePdf } from '../controllers/pdf.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function createRoutes(service: PdfService): IRouter {
	const router = createRouter({ mergeParams: true });
	const generatePdfController = postGeneratePdf(service);

	router.use((req, res, next) => {
		console.log('content-type');
		console.log(req.headers['content-type']);
		console.log('body keys');
		console.log(Object.keys(req.body || {}));
		console.log('body');
		console.log(req.body);
		next();
	});

	router.post('/generate', asyncHandler(generatePdfController));

	return router;
}
