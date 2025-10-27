import type { Response, Request, NextFunction } from 'express';

export function cacheNoStoreMiddleware(req: Request, res: Response, next: NextFunction) {
	res.set('Cache-Control', 'no-store');
	next();
}

export function cacheNoCacheMiddleware(req: Request, res: Response, next: NextFunction) {
	res.set('Cache-Control', 'no-cache');
	next();
}

export function cacheDisableAllCachingMiddleware(req: Request, res: Response, next: NextFunction) {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
	next();
}
