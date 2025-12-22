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
import { WHITELIST_USER_ROLE_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';

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

export function buildSubmitEmailController(service: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { db, notifyClient, enableE2eTestEndpoints, logger } = service;

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

		const [serviceUser, whitelistUser] = await Promise.all([
			db.nsipServiceUser.findFirst({
				where: { caseReference, email: emailAddress }
			}),
			db.whitelistUser.findUnique({
				where: { caseReference_email: { caseReference, email: emailAddress } }
			})
		]);

		if (!serviceUser && !whitelistUser) {
			return res.redirect(`${req.baseUrl}/no-access`);
		}

		const email = emailAddress.toLowerCase();
		if (serviceUser?.email.toLowerCase() !== email && whitelistUser?.email.toLowerCase() !== email) {
			return res.redirect(`${req.baseUrl}/no-access`);
		}

		const otpRecord = await getOtpRecord(db, emailAddress, caseReference);
		if (otpRecord && sentInLastTenSeconds(otpRecord)) {
			return handleError({ emailAddress: 'Code already requested' });
		}

		const oneTimePassword = enableE2eTestEndpoints ? 'ABCDE' : generateOtp();

		await saveOtp(db, emailAddress, caseReference, oneTimePassword);

		// Only send via Notify when not in test-tools mode
		if (!enableE2eTestEndpoints) {
			await notifyClient?.sendOneTimePasswordNotification(emailAddress, { oneTimePassword });
		} else {
			logger?.info({ emailAddress, caseReference }, 'Test tools enabled: skipping Notify OTP send');
		}

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

		await db.$transaction(async ($tx) => {
			const caseData = await $tx.case.upsert({
				where: { reference: caseReference },
				update: {},
				create: { reference: caseReference, email: emailAddress },
				include: {
					Whitelist: true
				}
			});

			if (caseData.Whitelist.length === 0) {
				logger.info('Setting up case whitelist');

				await $tx.whitelistUser.upsert({
					where: {
						caseReference_email: {
							caseReference,
							email: emailAddress
						}
					},
					update: {},
					create: {
						caseReference,
						email: emailAddress,
						isInitialInvitee: true,
						UserRole: {
							connect: {
								id: WHITELIST_USER_ROLE_ID.ADMIN_USER
							}
						},
						Case: {
							connect: {
								id: caseData.id
							}
						}
					}
				});
			}
		});

		req.session.regenerate((error) => {
			if (error) {
				throw error;
			}

			req.session.isAuthenticated = true;
			req.session.emailAddress = emailAddress;
			req.session.caseReference = caseReference;

			logger.info('User authenticated, redirecting to the landing page');

			return res.redirect(`/`);
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

export function buildTestSetupCase(service: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { db, logger } = service;
		// Belt-and-braces: only work when test tools are enabled.
		if (!service.enableE2eTestEndpoints) {
			res.status(404).send();
			return;
		}
		logger.info(
			{ headerToken: req.get('x-test-tools-token'), envTokenPresent: !!process.env.TEST_TOOLS_TOKEN },
			'test-tools token debug'
		);
		// Require a shared secret so the endpoint isn't callable by anyone
		// in a shared test environment.
		const token = req.get('x-test-tools-token');
		const expectedToken = service.testToolsToken;
		if (!expectedToken || token !== expectedToken) {
			res.status(404).send();
			return;
		}

		const { emailAddress, caseReference } = req.body as {
			emailAddress?: string;
			caseReference?: string;
		};

		if (!emailAddress || !caseReference) {
			res.status(400).send('emailAddress and caseReference are required');
			return;
		}

		await db.$transaction(async ($tx) => {
			const caseData = await $tx.case.upsert({
				where: { reference: caseReference },
				// optional: keep email in sync if the case already exists
				update: { email: emailAddress },
				create: { reference: caseReference, email: emailAddress }
			});

			// Ensure whitelist exists so /login/sign-in won't redirect to /no-access
			await $tx.whitelistUser.upsert({
				where: {
					caseReference_email: { caseReference, email: emailAddress }
				},
				update: {},
				create: {
					caseReference,
					email: emailAddress,
					isInitialInvitee: true,
					UserRole: {
						connect: { id: WHITELIST_USER_ROLE_ID.ADMIN_USER }
					},
					Case: { connect: { id: caseData.id } }
				}
			});
		});

		logger.info({ emailAddress, caseReference }, 'Test setup complete');
		res.status(204).send();
	};
}
