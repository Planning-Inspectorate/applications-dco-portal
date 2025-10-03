import { buildRouter } from './router.js';
import { configureNunjucks } from './nunjucks.js';
import bodyParser from 'body-parser';
import express from 'express';
import { initSessionMiddleware } from '@pins/dco-portal-lib/util/session.js';
import { buildLogRequestsMiddleware } from '@pins/dco-portal-lib/middleware/log-requests.js';
import { initContentSecurityPolicyMiddlewares } from '@pins/dco-portal-lib/middleware/csp-middleware.js';
import { buildDefaultErrorHandlerMiddleware, notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.js';
import { addLocalsConfiguration } from '#util/config-middleware.js';

/**
 * @param {import('#service').PortalService} service
 * @returns {Express}
 */
export function createApp(service) {
	// create an express app, and configure it for our usage
	const app = express();

	const logRequests = buildLogRequestsMiddleware(service.logger);
	app.use(logRequests);

	// configure body-parser, to populate req.body
	// see https://expressjs.com/en/resources/middleware/body-parser.html
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	const sessionMiddleware = initSessionMiddleware({
		redis: service.redisClient,
		secure: service.secureSession,
		secret: service.sessionSecret
	});
	app.use(sessionMiddleware);

	app.use(...initContentSecurityPolicyMiddlewares());

	// static files
	app.use(express.static(service.staticDir, service.cacheControl));

	if (configureNunjucks) {
		const nunjucksEnvironment = configureNunjucks();
		// Set the express view engine to nunjucks
		// calls to res.render will use nunjucks
		nunjucksEnvironment.express(app);
		app.set('view engine', 'njk');
	}

	app.use(addLocalsConfiguration());

	const router = buildRouter(service);
	// register the router, which will define any subpaths
	// any paths not defined will return 404 by default
	app.use('/', router);

	app.use(notFoundHandler);

	const defaultErrorHandler = buildDefaultErrorHandlerMiddleware(service.logger);
	// catch/handle errors last
	app.use(defaultErrorHandler);

	return app;
}
