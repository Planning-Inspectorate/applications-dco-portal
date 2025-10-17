export function isUserAuthenticated(req: any, res: any, next: any) {
	if (req.session && req.session.isAuthenticated) {
		return next();
	}
	res.redirect('/login/email-address');
}

export function isUserUnauthenticated(req: any, res: any, next: any) {
	if (req.session && req.session.isAuthenticated) {
		return res.redirect('/');
	}
	return next();
}
