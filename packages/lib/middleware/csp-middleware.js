import helmet from 'helmet';
import crypto from 'node:crypto';

/**
 * @returns {import('express').Handler[]}
 */
export function initContentSecurityPolicyMiddlewares() {
	/** @type {import('express').Handler[]} */
	const middlewares = [];

	// Generate the nonce for each request
	middlewares.push((req, res, next) => {
		res.locals.cspNonce = crypto.randomBytes(32).toString('hex');
		next();
	});

	// Secure apps by setting various HTTP headers
	middlewares.push(helmet());

	middlewares.push(
		helmet.contentSecurityPolicy({
			scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
			defaultSrc: ["'self'"],
			connectSrc: ["'self'"],
			fontSrc: ["'self'"],
			imgSrc: ["'self'"],
			styleSrc: ["'self'"]
		})
	);

	return middlewares;
}
