import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import {
	expressValidationErrorsToGovUkErrorList
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';
import { SCAN_RESULT_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { mapCaseDataToBackOfficeFormat, mapDocumentsToBackOfficeFormat } from './mappers.ts';
import { DATA_SUBMISSIONS_TOPIC_NAME, EVENT_TYPE } from '@pins/dco-portal-lib/event/constants.ts';

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
		if (!positionInOrganisation) {
			logger.info({ positionInOrganisation }, 'no value provided for positionInOrganisation');

			req.body.errors = {
				positionInOrganisation: { msg: 'Enter your position in your organisation' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);
		} else if (positionInOrganisation.length > 250) {
			logger.info({ positionInOrganisation }, 'invalid value provided for positionInOrganisation');

			req.body.errors = {
				positionInOrganisation: { msg: 'Organisation must be 250 characters or less' }
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

export function buildSubmitDeclaration(service: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { declarationConfirmation } = req.body;
		const { db, logger, blobStore, serviceBusEventClient } = service;

		if (!declarationConfirmation) {
			logger.info({ declarationConfirmation }, 'no value provided for positionInOrganisation');

			req.body.errors = {
				declarationConfirmation: { msg: 'You must confirm you understand and accept the declaration' }
			};
			req.body.errorSummary = expressValidationErrorsToGovUkErrorList(req.body.errors);

			const declarationPage = buildDeclarationPage({
				errors: req.body.errors,
				errorSummary: req.body.errorSummary
			});
			return declarationPage(req, res);
		}

		const caseReference = req.session.caseReference;

		if (!caseReference) {
			return notFoundHandler(req, res);
		}

		const caseData = await db.case.findUnique({
			where: { reference: caseReference },
			include: {
				ApplicantDetails: {
					include: {
						Address: true
					}
				},
				AgentDetails: {
					include: {
						Address: true
					}
				},
				CasePaymentMethod: true,
				ProjectSingleSite: true,
				ProjectLinearSite: true,
				NonOffshoreGeneratingStation: true,
				OffshoreGeneratingStation: true,
				HighwayRelatedDevelopment: true,
				RailwayDevelopment: true,
				HarbourFacilities: true,
				Pipelines: true,
				HazardousWasteFacility: true,
				DamOrReservoir: true
			}
		});

		if (!caseData) {
			return notFoundHandler(req, res);
		}

		try {
			await blobStore?.moveFolder(caseReference, db);
		} catch (error) {
			logger.error({ error }, 'error moving case documents to back office container in blob store');
			throw new Error('error moving documents during case submission');
		}

		const documents = await db.document.findMany({
			where: {
				caseId: caseData.id,
				scanResultId: SCAN_RESULT_ID.SCANNED
			},
			include: {
				Case: true,
				SubCategory: {
					include: {
						Category: true
					}
				}
			}
		});

		const submissionDate = new Date();

		const mappedCaseData = mapCaseDataToBackOfficeFormat(caseData, submissionDate, req.session.positionInOrganisation);
		const mappedDocuments = mapDocumentsToBackOfficeFormat(documents);

		serviceBusEventClient?.sendEvents(
			DATA_SUBMISSIONS_TOPIC_NAME,
			[
				{
					mappedCaseData,
					mappedDocuments
				}
			],
			EVENT_TYPE.PUBLISH
		);

		await db.case.update({
			where: { reference: caseReference },
			data: {
				submissionDate: submissionDate,
				submitterPositionInOrganisation: req.session.positionInOrganisation
			}
		});

		service.eventEmitter.emit('generatePdf', {
			caseReference: req.session.caseReference,
			styleFile: res.locals.config.styleFile
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
			canDownloadPdf: caseData.pdfBlobName ? true : false,
			dateSubmitted: formatDateForDisplay(caseData.submissionDate, { format: "h:mma 'on' d MMMM yyyy" })
		});
	};
}

export function buildDownloadApplicationPdf(service: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const { blobStore, db, logger } = service;
		const caseReference = req.session.caseReference;

		const caseData = await db.case.findUnique({
			where: { reference: req.session.caseReference }
		});

		if (!caseData?.pdfBlobName) {
			return notFoundHandler(req, res);
		}

		const blobName = caseData.pdfBlobName;
		try {
			const downloadResponse = await blobStore?.downloadBlob(blobName);

			res.setHeader('Content-Type', downloadResponse?.contentType || 'application/octet-stream');
			res.setHeader('Content-Length', downloadResponse?.contentLength || 0);
			res.setHeader('Content-Disposition', `inline; filename="${blobName}"`);

			const downloadStream = downloadResponse?.readableStreamBody;

			downloadStream?.on('error', (err) => {
				if (err?.name === 'AbortError') {
					logger.debug({ caseReference }, 'file download cancelled');
				} else {
					logger.error({ err, caseReference }, 'file download stream error');
				}
				res.destroy(err);
			});

			downloadStream?.pipe(res);
		} catch (error) {
			logger.error(
				{ error, blobName },
				`Error downloading pdf submission file for case: ${caseReference} from Blob store`
			);
			throw new Error('Failed to download pdf file from blob store');
		}
	};
}
