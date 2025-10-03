export function isAuthenticated(req, res, next) {
	if (req.session && req.session.isAuthenticated) {
		return next();
	}
	res.redirect('/login/email-address');
}
