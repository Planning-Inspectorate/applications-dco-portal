// @ts-expect-error - due to not having @types
import bcrypt from 'bcrypt';
// @ts-expect-error - due to not having @types
import { expressValidationErrorsToGovUkErrorList } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import {
	isValidCaseReference,
	isValidEmailAddress,
	isValidOtpCode,
	isValidOtpRecord,
	sentInLastTenSeconds
} from './util/validation.ts';
import { deleteOtp, generateOtp, getOtpRecord, incrementOtpAttempts, saveOtp } from './util/otp-service.ts';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { PortalService } from '#service';

export function buildHasApplicationReferencePage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		const hasReferenceNumberValue = req.session.hasReferenceNumber;
		return res.render('views/login/application-reference.njk', {
			questionText: 'Do you have an application reference number?',
			hintText: 'For example, EN012345',
			hasReferenceNumberValue,
			...viewData
		});
	};
}

export function buildSubmitHasApplicationReference({ logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { hasReferenceNumber } = req.body;

		if (!hasReferenceNumber) {
			logger.info({ hasReferenceNumber }, 'no value provided for hasReferenceNumber');

			req.body.errors = {
				hasReferenceNumber: { msg: 'You must select an answer' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const hasApplicationReferencePage = buildHasApplicationReferencePage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return hasApplicationReferencePage(req, res);
		}

		req.session.hasReferenceNumber = hasReferenceNumber;

		if (hasReferenceNumber === BOOLEAN_OPTIONS.NO) {
			return res.redirect(`${req.baseUrl}/no-access`);
		}

		return res.redirect(`${req.baseUrl}/sign-in`);
	};
}

export function buildEnterEmailPage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/email.njk', {
			pageTitle: 'Sign-in',
			emailQuestionText: 'Email address',
			caseReferenceQuestionText: 'Application reference number',
			caseReferenceHintText:
				'You can find this in the email inviting you to sign in to this service. For example, EN012345',
			backLinkUrl: `${req.baseUrl}/application-reference-number`,
			...viewData
		});
	};
}

export function buildSubmitEmailController({ db, notifyClient }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { emailAddress, caseReference } = req.body;

		const handleError = async (errors: Record<string, string>) => {
			req.body.errors = req.body.errors || {};
			for (const [field, message] of Object.entries(errors)) {
				req.body.errors[field] = { msg: message };
			}
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const enterEmailPage = buildEnterEmailPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return enterEmailPage(req, res);
		};

		if (!isValidEmailAddress(emailAddress) && !isValidCaseReference(caseReference)) {
			return handleError({
				emailAddress: 'Invalid email address',
				caseReference: 'You must provide a valid case reference'
			});
		}

		if (!isValidEmailAddress(emailAddress)) {
			return handleError({ emailAddress: 'Invalid email address' });
		}

		if (!isValidCaseReference(caseReference)) {
			return handleError({ caseReference: 'You must provide a valid case reference' });
		}

		const otpRecord = await getOtpRecord(db, emailAddress, caseReference);
		if (otpRecord && sentInLastTenSeconds(otpRecord)) {
			return handleError({ emailAddress: 'Code already requested' });
		}

		const oneTimePassword = generateOtp();
		await saveOtp(db, emailAddress, caseReference, oneTimePassword);
		await notifyClient?.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });

		req.session.emailAddress = emailAddress;
		req.session.caseReference = caseReference;

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
			backLinkUrl: `${req.baseUrl}/sign-in`,
			...viewData
		});
	};
}

export function buildSubmitOtpController({ db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const emailAddress = req.session.emailAddress;
		const caseReference = req.session.caseReference;

		if (!emailAddress || !caseReference) {
			logger.error('email address and case reference not present');
			return res.redirect(`${req.baseUrl}/application-reference-number`);
		}

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

		const otpRecord = await getOtpRecord(db, emailAddress, caseReference);

		if (!isValidOtpCode(otpCode)) {
			return handleOtpError('Provided OTP failed validation');
		}

		if (!isValidOtpRecord(otpRecord)) {
			return res.redirect(`${req.baseUrl}/request-new-code`);
		}

		const isMatch = await bcrypt.compare(otpCode.trim().toUpperCase(), otpRecord?.hashedOtpCode);
		if (!isMatch) {
			await incrementOtpAttempts(db, emailAddress, caseReference);
			return handleOtpError('Provided OTP does not match stored OTP');
		}

		await deleteOtp(db, emailAddress, caseReference);

		req.session.regenerate((error) => {
			if (error) {
				throw error;
			}

			req.session.isAuthenticated = true;
			req.session.emailAddress = emailAddress;
			req.session.caseReference = caseReference;

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
		const caseReference = req.session.caseReference;

		if (emailAddress && caseReference) {
			const oneTimePassword = generateOtp();
			await saveOtp(db, emailAddress, caseReference, oneTimePassword);
			await notifyClient?.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });
			return res.redirect(`${req.baseUrl}/enter-code`);
		}
		res.redirect(`${req.baseUrl}/sign-in`);
	};
}

export function buildNoAccessPage(): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/login/no-access.njk', {
			pageTitle: 'You do not have access to this service'
		});
	};
}
