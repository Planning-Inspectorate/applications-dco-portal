import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import { isValidEmailAddress, isValidOtpCode } from './validation.js';

/**
 * @returns {import('express').Handler}
 */
export function buildEnterEmailPage() {
	return async (req, res, viewData = {}) => {
		return res.render('views/login/email.njk', {
			questionText: 'What is your email address?',
			hintText: 'If we recognise this address, we will send you a code.',
			backLinkUrl: '/',
			...viewData
		});
	};
}

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Handler}
 */
export function buildSubmitEmailController({ logger, notifyClient }) {
	return async (req, res) => {
		const { emailAddress } = req.body;

		if (!isValidEmailAddress(emailAddress)) {
			req.body.errors = {
				emailAddress: {
					msg: 'Error message'
				}
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const enterEmailPage = buildEnterEmailPage();
			return enterEmailPage(req, res, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		}

		// TODO: use new code generator to replace below
		const oneTimePassword = 'ABCDE';
		await notifyClient.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });

		// TODO: store email and OTP along with TTL in new DB relation

		logger.info('OTP email dispatched');

		return res.redirect('/enter-code');
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildEnterOtpPage() {
	return async (req, res, viewData = {}) => {
		return res.render('views/login/otp.njk', {
			questionText: 'Enter the code we sent to your email address',
			backLinkUrl: '/email-address',
			...viewData
		});
	};
}

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Handler}
 */
export function buildSubmitOtpController({ logger }) {
	return async (req, res) => {
		const { otpCode } = req.body;

		if (!isValidOtpCode(otpCode)) {
			req.body.errors = {
				otpCode: {
					msg: 'Error message'
				}
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			logger.info('Provided OTP failed validation ', otpCode);

			const enterOtpPage = buildEnterOtpPage();
			return enterOtpPage(req, res, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		}

		// TODO: initiate session and set timeouts etc and confirm user as authenticated etc

		return res.redirect('/');
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildRequestNewCodePage() {
	return async (req, res) => {
		return res.render('views/login/request-new-code.njk', {
			questionText: 'Request a new code',
			backLinkUrl: '/enter-code'
		});
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildSubmitNewCodeRequestController() {
	return async (req, res) => {
		//TODO: update this placeholder controller
		return res.redirect('/enter-code');
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildNoAccessPage() {
	return async (req, res) => {
		return res.render('views/login/no-access.njk', {
			pageTitle: 'You do not have access to this service'
		});
	};
}
