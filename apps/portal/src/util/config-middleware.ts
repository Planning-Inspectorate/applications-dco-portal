import type { Handler } from 'express';

/**
 * Add configuration values to locals.
 */
export function addLocalsConfiguration(): Handler {
	return (req, res, next) => {
		res.locals.config = {
			styleFile: 'style-2f41dd94.css',
			cspNonce: res.locals.cspNonce,
			headerTitle: 'Apply for a Development Consent Order',
			footerLinks: [
				{
					text: 'Terms and conditions',
					href: '/terms-and-conditions'
				},
				{
					text: 'Accessibility statement',
					href: '/accessibility-statement'
				},
				{
					text: 'Privacy',
					href: 'https://www.gov.uk/government/publications/planning-inspectorate-privacy-notices/customer-privacy-notice'
				},
				{
					text: 'Cookies',
					href: '/cookies'
				},
				{
					text: 'Contact',
					href: '/contact'
				}
			],
			signOutLink: req.session.isAuthenticated
				? `<li class="govuk-service-navigation__item logout-item"><a href="/sign-out" class="govuk-service-navigation__link">Sign out</a></li>`
				: ''
		};
		next();
	};
}
