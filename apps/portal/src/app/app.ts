import { buildRouter } from './router.ts';
import { configureNunjucks } from './nunjucks.ts';
import cookieParser from 'cookie-parser';
import { addLocalsConfiguration } from '#util/config-middleware.ts';
import type { Express } from 'express';
import type { PortalService } from '#service';
import { registerDailyJob } from './schedule/notification/notify-submission-date-passed.ts';
import { createBaseApp } from '@planning-inspectorate/core';

/**
 * @param {import('#service').PortalService} service
 * @returns {Express}
 */
export function createApp(service: PortalService): Express {
	const router = buildRouter(service);
	const app = createBaseApp({
		service,
		router,
		configureNunjucks,
		middlewares: [addLocalsConfiguration(), cookieParser()]
	});

	registerDailyJob(service);

	return app;
}
