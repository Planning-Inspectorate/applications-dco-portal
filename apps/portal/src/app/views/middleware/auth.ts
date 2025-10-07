export function isAuthenticated(req: any, res: any, next: any) {
	if (req.session && req.session.isAuthenticated) {
		return next();
	}
	res.redirect('/login/email-address');
}
