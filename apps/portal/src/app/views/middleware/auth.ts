import type { Request, Response, NextFunction } from 'express';

export function isUserAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.session && req.session.isAuthenticated) {
		return next();
	}
	res.redirect('/login/email-address');
}

export function isUserUnauthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.session && req.session.isAuthenticated) {
		return res.redirect('/');
	}
	return next();
}
