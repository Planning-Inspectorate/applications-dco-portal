// @ts-expect-error - due to not having @types
import bcrypt from 'bcrypt';
// @ts-expect-error - due to not having @types
import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import { isValidEmailAddress, isValidOtpCode, isValidOtpRecord, sentInLastTenSeconds } from './util/validation.ts';
import { deleteOtp, generateOtp, getOtpRecord, incrementOtpAttempts, saveOtp } from './util/otp-service.ts';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { PortalService } from '#service';

export function buildEnterEmailPage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/email.njk', {
			questionText: 'What is your email address?',
			hintText: 'If we recognise this address, we will send you a code.',
			...viewData
		});
	};
}

export function buildSubmitEmailController({ db, notifyClient, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { emailAddress } = req.body;

		const handleEmailError = async (message: string) => {
			req.body.errors = {
				emailAddress: { msg: message }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			logger.info({ emailAddress }, message);

			const enterEmailPage = buildEnterEmailPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return enterEmailPage(req, res);
		};

		if (!isValidEmailAddress(emailAddress)) {
			return handleEmailError('Invalid email address');
		}

		const otpRecord = await getOtpRecord(db, emailAddress);
		if (otpRecord && sentInLastTenSeconds(otpRecord)) {
			return handleEmailError('Code already requested');
		}

		const oneTimePassword = generateOtp();
		await saveOtp(db, emailAddress, oneTimePassword);
		await notifyClient?.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });

		req.session.emailAddress = emailAddress;

		return res.redirect(`${req.baseUrl}/enter-code`);
	};
}

/**
 * @returns {import('express').Handler}
 */
export function buildEnterOtpPage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/otp.njk', {
			questionText: 'Enter the code we sent to your email address',
			backLinkUrl: `${req.baseUrl}/email-address`,
			...viewData
		});
	};
}

export function buildSubmitOtpController({ db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const emailAddress = req.session.emailAddress;
		const { otpCode } = req.body;

		const handleOtpError = async (message: string) => {
			req.body.errors = {
				otpCode: { msg: message }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			logger.info({ otpCode, emailAddress }, message);

			const enterOtpPage = buildEnterOtpPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return enterOtpPage(req, res);
		};

		const otpRecord = await getOtpRecord(db, emailAddress);

		if (!isValidOtpCode(otpCode)) {
			return handleOtpError('Provided OTP failed validation');
		}

		if (!isValidOtpRecord(otpRecord)) {
			return res.redirect(`${req.baseUrl}/request-new-code`);
		}

		const isMatch = await bcrypt.compare(otpCode.trim().toUpperCase(), otpRecord?.hashedOtpCode);
		if (!isMatch) {
			await incrementOtpAttempts(db, emailAddress);
			return handleOtpError('Provided OTP does not match stored OTP');
		}

		await deleteOtp(db, emailAddress);

		req.session.regenerate((error) => {
			if (error) {
				throw error;
			}

			req.session.isAuthenticated = true;
			req.session.emailAddress = emailAddress;
			// TODO: add case reference to session once we have it
			// TODO: once the user logs into the service
			//  - check if a case in DCO portal DB exists
			//  - if not create a blank case with the email and case reference

			logger.info('User authenticated, redirecting to the landing page');

			return res.redirect('/');
		});
	};
}

export function buildRequestNewCodePage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/request-new-code.njk', {
			questionText: 'Request a new code',
			backLinkUrl: `${req.baseUrl}/enter-code`
		});
	};
}

export function buildSubmitNewCodeRequestController({ db, notifyClient }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const emailAddress = req.session.emailAddress;
		const oneTimePassword = generateOtp();

		if (emailAddress) {
			await saveOtp(db, emailAddress, oneTimePassword);
			await notifyClient?.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });
			return res.redirect(`${req.baseUrl}/enter-code`);
		}
		res.redirect(`${req.baseUrl}/email-address`);
	};
}

export function buildNoAccessPage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/no-access.njk', {
			pageTitle: 'You do not have access to this service'
		});
	};
}
