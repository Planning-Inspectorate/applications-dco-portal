import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { PdfService } from '#service';
import { createRoutes as pdfRoutes } from './pdf.ts';
import { createMonitoringRoutes } from '@pins/dco-portal-lib/controllers/monitoring.ts';

export function buildRouter(service: PdfService): IRouter {
	const router = createRouter();
	const monitoringRoutes = createMonitoringRoutes(service);

	router.use('/', monitoringRoutes);

	router.use('/api/v1', pdfRoutes(service));

	return router;
}
