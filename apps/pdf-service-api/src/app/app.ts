import { buildRouter } from './routes/index.ts';
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import type { Express } from 'express';
import { PdfService } from '#service';
import type { HelmetCspDirectives } from '@pins/dco-portal-lib/middleware/csp-middleware.ts';
import { initContentSecurityPolicyMiddlewares } from '@pins/dco-portal-lib/middleware/csp-middleware.ts';
import { buildLogRequestsMiddleware } from '@pins/dco-portal-lib/middleware/log-requests.ts';

/**
 * @param {import('#service').PdfService} service
 * @returns {Express}
 */
export function createApp(service: PdfService): Express {
	const app = express();

	const logRequests = buildLogRequestsMiddleware(service.logger);
	app.use(logRequests);

	//limit json size to prevent large files
	app.use(
		express.json({
			limit: service.fileUpload.maxSizeInBytes
		})
	);

	// configure body-parser, to populate req.body
	// see https://expressjs.com/en/resources/middleware/body-parser.html
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(...initContentSecurityPolicyMiddlewares(cspDirectiveDefaults));

	app.use(cookieParser());

	const router = buildRouter(service);
	// register the router, which will define any subpaths
	// any paths not defined will return 404 by default
	app.use('/', router);

	//A catch-all handler to send a 404 response
	app.use((req, res) => {
		res.status(404);
		res.send({ error: 'Not found' });
	});

	return app;
}

const cspDirectiveDefaults: HelmetCspDirectives = {
	scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
	defaultSrc: ["'self'"],
	connectSrc: ["'self'"],
	fontSrc: ["'self'"],
	imgSrc: ["'self'"],
	styleSrc: ["'self'"]
};
