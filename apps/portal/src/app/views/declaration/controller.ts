import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import {
	expressValidationErrorsToGovUkErrorList
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';

export function buildPositionInOrganisationPage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/declaration/position-in-org.njk', {
			backLinkUrl: `/`,
			...viewData
		});
	};
}

export function buildSavePositionInOrganisation({ logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { positionInOrganisation } = req.body;
		const regex = /^(?=.*[A-Za-z])[A-Za-z ]+$/;

		if (!positionInOrganisation) {
			logger.info({ positionInOrganisation }, 'no value provided for positionInOrganisation');

			req.body.errors = {
				positionInOrganisation: { msg: 'You must select an answer' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);
		} else if (!regex.test(positionInOrganisation)) {
			logger.info({ positionInOrganisation }, 'invalid value provided for positionInOrganisation');

			req.body.errors = {
				positionInOrganisation: { msg: 'Your answer must contain only letters' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);
		}

		if (req.body.errors) {
			const positionInOrganisationPage = buildPositionInOrganisationPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return positionInOrganisationPage(req, res);
		}

		req.session.positionInOrganisation = positionInOrganisation;

		return res.redirect('/declaration');
	};
}

export function buildDeclarationPage(viewData = {}): AsyncRequestHandler {
	return async (req, res) => {
		return res.render('views/declaration/declaration.njk', {
			backLinkUrl: `/position-in-organisation`,
			...viewData
		});
	};
}

export function buildSubmitDeclaration({ db, logger, blobStore }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { declarationConfirmation } = req.body;

		if (!declarationConfirmation) {
			logger.info({ declarationConfirmation }, 'no value provided for positionInOrganisation');

			req.body.errors = {
				declarationConfirmation: { msg: 'You must confirm that you understand and accept this declaration' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const declarationPage = buildDeclarationPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return declarationPage(req, res);
		}

		try {
			await blobStore?.moveFolder(req.session.caseReference as string);
		} catch (error) {
			logger.error({ error }, 'error moving case documents to back office container in blob store');
			throw new Error('error moving documents during case submission');
		}

		await db.case.update({
			where: { reference: req.session.caseReference },
			data: {
				submissionDate: new Date(),
				submitterPositionInOrganisation: req.session.positionInOrganisation
			}
		});

		return res.redirect('/application-complete');
	};
}

export function buildApplicationCompletePage({ db }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const caseData = await db.case.findUnique({
			where: { reference: req.session.caseReference }
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		return res.render('views/declaration/application-complete.njk', {
			caseReference: req.session.caseReference,
			dateSubmitted: formatDateForDisplay(caseData.submissionDate, { format: "h:mma 'on' d MMMM yyyy" })
		});
	};
}
