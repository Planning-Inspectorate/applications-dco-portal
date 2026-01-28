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
			serviceFeedbackLink:
				'https://mcas-proxyweb.mcas.ms/certificate-checker?login=false&originalUrl=https%3A%2F%2Fforms.office.com.mcas.ms%2Fe%2FkPEzg1fZLx%3FMcasTsid%3D20596&McasCSRF=ed470696e3d88b7fea1c220720cea2359502eb2b52c61486d0f4d42cafdb42dd',
			signOutLink: req.session.isAuthenticated
				? `<li class="govuk-service-navigation__item logout-item"><a href="/sign-out" class="govuk-service-navigation__link">Sign out</a></li>`
				: ''
		};
		next();
	};
}
