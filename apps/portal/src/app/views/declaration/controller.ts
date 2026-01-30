import type { PortalService } from '#service';
import type { AsyncRequestHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { notFoundHandler } from '@pins/dco-portal-lib/middleware/errors.ts';
import {
	expressValidationErrorsToGovUkErrorList
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
// @ts-expect-error - due to not having @types
import { formatDateForDisplay } from '@planning-inspectorate/dynamic-forms/src/lib/date-utils.js';
import { mapCaseToDcoApplication } from '@pins/dco-portal-lib/pdf-service/mappers/dco-application-mapper.ts';
import { addCSStoHtml } from '@pins/dco-portal-lib/util/add-css-to-html.ts';

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

export function buildSubmitDeclaration({
	db,
	logger,
	blobStore,
	pdfServiceClient
}: PortalService): AsyncRequestHandler {
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

		//skip pdf generation if required services not configured
		if (pdfServiceClient && blobStore) {
			try {
				const caseData = await db.case.findUnique({
					where: { reference: req.session.caseReference },
					include: {
						SupportingEvidence: {
							include: { Document: true }
						},
						ApplicantDetails: {
							include: { Address: true }
						},
						AgentDetails: {
							include: { Address: true }
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
				if (!caseData?.anticipatedDateOfSubmission)
					throw new Error('anticipated date of submission is missing from case data');

				const dcoApplicationData = mapCaseToDcoApplication(caseData);
				res.render(
					'views/layouts/application-pdf.njk',
					{
						dcoApplicationData
					},
					async (error, html) => {
						if (error) {
							throw error;
						}
						const pdfHtml = await addCSStoHtml(html, 'main.min.css');
						const pdf = await pdfServiceClient.generatePdf(pdfHtml);

						if (!Buffer.isBuffer(pdf) || pdf.length === 0) {
							throw new Error('PDF generation returned an invalid or empty buffer');
						}

						const blobName = getPdfBlobName(req.session.caseReference as string, caseData.anticipatedDateOfSubmission!);
						try {
							await blobStore.deleteBlobIfExists(blobName);
						} catch {
							logger.info('no existing pdf to delete prior to upload');
						}

						await blobStore.upload(pdf, 'application/pdf', blobName);
					}
				);
			} catch (error) {
				logger.error({ error }, 'error generating pdf document from submission data');
				throw new Error('error generating pdf document from submission data');
			}
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

export function buildDownloadApplicationPdf({ blobStore, db, logger }: PortalService): AsyncRequestHandler {
	return async (req, res) => {
		const caseReference = req.session.caseReference;
		let blobName;
		try {
			const caseData = await db.case.findUnique({
				where: { reference: req.session.caseReference }
			});
			if (!blobStore) throw new Error('blob store not configured');
			if (!caseData?.anticipatedDateOfSubmission) throw new Error('anticipated submission date not found');

			blobName = getPdfBlobName(caseReference as string, caseData.anticipatedDateOfSubmission);
			const downloadResponse = await blobStore.downloadBlob(blobName);
			if (!downloadResponse) throw new Error('pdf blob not found');

			res.setHeader('Content-Type', downloadResponse.contentType || 'application/octet-stream');
			res.setHeader('Content-Length', downloadResponse.contentLength || 0);
			res.setHeader('Content-Disposition', `inline; filename="${blobName}"`);

			const downloadStream = downloadResponse.readableStreamBody;

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
			logger.error({ error, blobName }, `Error downloading pdf submission file: ${blobName} from Blob store`);
			throw new Error('Failed to download pdf file from blob store');
		}
	};
}

function getPdfBlobName(caseReference: string, anticipatedDateOfSubmission: Date): string {
	if (!caseReference || !anticipatedDateOfSubmission) throw new Error('Case reference or anticipated date ');
	const normalisedAnticipatedDateOfSubmission = new Date(anticipatedDateOfSubmission as Date);
	normalisedAnticipatedDateOfSubmission.setHours(0, 0, 0, 0);
	return `${caseReference}/data-submissions/${normalisedAnticipatedDateOfSubmission.toISOString().slice(0, 10)}-submission.pdf`;
}
