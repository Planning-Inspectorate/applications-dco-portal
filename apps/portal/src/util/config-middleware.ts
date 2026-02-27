import type { Handler } from 'express';

/**
 * Add configuration values to locals.
 */
export function addLocalsConfiguration(): Handler {
	return (req, res, next) => {
		res.locals.config = {
			styleFile: 'style-edb2fbb5.css',
			cspNonce: res.locals.cspNonce,
			headerTitle: 'Apply for and manage your infrastructure project',
			serviceUrl: '/',
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
			serviceFeedbackLink:
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjVqzqAxXAi1LghAWTH6Y3OJUMlI5MjJCMVdGUEYxMEVROVJKUUQ3ODFRWC4u&route=shorturl',
			signOutLink: req.session.isAuthenticated
				? `<li class="govuk-service-navigation__item logout-item"><a href="/sign-out" class="govuk-service-navigation__link">Sign out</a></li>`
				: ''
		};
		next();
	};
}
