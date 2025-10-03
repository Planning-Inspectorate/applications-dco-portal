import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import { isValidEmailAddress, isValidOtpCode, isValidOtpRecord } from './util/validation.js';
import { deleteOtp, generateOtp, getOtpRecord, incrementOtpAttempts, saveOtp } from './util/otp-service.js';
import bcrypt from 'bcrypt';

/**
 * @returns {import('express').Handler}
 */
export function buildEnterEmailPage() {
	return async (req, res, viewData = {}) => {
		return res.render('views/login/email.njk', {
			questionText: 'What is your email address?',
			hintText: 'If we recognise this address, we will send you a code.',
			...viewData
		});
	};
}

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Handler}
 */
export function buildSubmitEmailController({ db, notifyClient, logger }) {
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

		const oneTimePassword = generateOtp();
		await saveOtp(db, emailAddress, oneTimePassword);
		await notifyClient.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });

		logger.info('OTP email dispatched');

		req.session.emailAddress = emailAddress;

		return res.redirect(`${req.baseUrl}/enter-code`);
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildEnterOtpPage() {
	return async (req, res, viewData = {}) => {
		return res.render('views/login/otp.njk', {
			questionText: 'Enter the code we sent to your email address',
			backLinkUrl: `${req.baseUrl}/email-address`,
			...viewData
		});
	};
}

/**
 * @param {import('#service').PortalService} service
 * @returns {import('express').Handler}
 */
export function buildSubmitOtpController({ db, logger }) {
	return async (req, res) => {
		const emailAddress = req.session.emailAddress;
		const { otpCode } = req.body;

		const handleOtpError = async (message) => {
			req.body.errors = {
				otpCode: { msg: 'Error message' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			logger.info(message, { otpCode, emailAddress });

			const enterOtpPage = buildEnterOtpPage();
			return enterOtpPage(req, res, {
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
		};

		const otpRecord = await getOtpRecord(db, emailAddress);

		if (!isValidOtpCode(otpCode) || !isValidOtpRecord(otpRecord)) {
			return handleOtpError('Provided OTP failed validation');
		}

		const isMatch = await bcrypt.compare(otpCode.trim().toUpperCase(), otpRecord.hashedOtpCode);
		if (!isMatch) {
			await incrementOtpAttempts(db, emailAddress);
			return handleOtpError('Provided OTP does not match stored OTP');
		}

		await deleteOtp(db, req.session.emailAddress);
		delete req.session.emailAddress;

		req.session.isAuthenticated = true;

		logger.info('User authenticated, redirecting to the landing page');

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
			backLinkUrl: `${req.baseUrl}/enter-code`
		});
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildSubmitNewCodeRequestController({ db, notifyClient }) {
	return async (req, res) => {
		const emailAddress = req.session.emailAddress;
		const oneTimePassword = generateOtp();

		await saveOtp(db, req.session.emailAddress, oneTimePassword);
		await notifyClient.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });

		return res.redirect(`${req.baseUrl}/enter-code`);
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
