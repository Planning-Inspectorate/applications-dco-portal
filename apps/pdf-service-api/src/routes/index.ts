import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { PdfService } from '#service';
import { createRoutes as pdfRoutes } from './pdf.ts';

export function buildRouter(service: PdfService): IRouter {
	const router = createRouter();

	/**
	 * index route to avoid azure always on ping 404s
	 */
	router.get('/', (req, res) => {
		res.sendStatus(204);
	});

	router.get('/health', (req, res) => {
		res.status(200).send({
			status: 'OK',
			uptime: process.uptime(),
			commit: service.gitSha
		});
	});

	router.use('/api/v1', pdfRoutes(service));

	return router;
}
