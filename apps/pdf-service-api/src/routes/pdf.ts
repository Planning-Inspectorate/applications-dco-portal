import { PdfService } from '#service';
import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import multer from 'multer';
import { postGeneratePdf } from '../controllers/pdf.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function createRoutes(service: PdfService): IRouter {
	const router = createRouter({ mergeParams: true });
	const generatePdfController = postGeneratePdf(service);

	router.post(
		'/generate',
		multer({
			limits: { fileSize: service.fileUpload.maxSizeInBytes },
			dest: service.fileUpload.path
		}).single('html'),
		asyncHandler(generatePdfController)
	);

	return router;
}
