import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { createRoutes as fileUploadRoutes } from './file-upload/index.ts';
import { createRoutes as applicantAgentDetailsRoutes } from './applicant-agent-details/index.ts';
import { createRoutes as aboutTheProjectRoutes } from './about-the-project/index.ts';
import { createRoutes as consultationAndPublicityDetailsRoutes } from './consultation-and-publicity-details/index.ts';
import { createRoutes as draftOrderAndExplanatoryMemorandumRoutes } from './draft-order-and-explanatory-memorandum/index.ts';
import { createRoutes as floodRiskInformationRoutes } from './flood-risk-information/index.ts';
import { createRoutes as habitatRegulationsAssessmentInformationRoutes } from './habitat-regulations-assessment-information/index.ts';
import { createRoutes as landAndWorksPlansRoutes } from './land-and-works-plans/index.ts';
import { createRoutes as landRightsInformationRoutes } from './land-rights-information/index.ts';
import { createRoutes as statutoryNuisanceInformationRoutes } from './statutory-nuisance-information/index.ts';
import { createRoutes as natureConservationAndEnvironmentInformationRoutes } from './nature-conservation-and-environmental-information/index.ts';
import { createRoutes as crownLandAccessAndRightsOfWayPlansRoutes } from './crown-land-access-and-rights-of-way-plans/index.ts';
import { createRoutes as otherConsentsOrLicencesRoutes } from './other-consents-or-licenses-details/index.ts';
import { createRoutes as environmentalImpactAssessmentInformationRoutes } from './environmental-impact-assessment/index.ts';
import { createRoutes as otherPlansAndReportsRoutes } from './other-plans-and-reports/index.ts';
import { createRoutes as infrastructureSpecificAdditionalInformationRoutes } from './infrastructure-specific-additional-information/index.ts';
import { createRoutes as whitelistRoutes } from './whitelist/index.ts';
import { PortalService } from '#service';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from './constants.ts';
import { buildHomePage } from './home/controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import { buildWhitelistMiddleware } from './middleware/whitelist-middleware.ts';
import { buildSignOutController } from './sign-out/controller.ts';
import {
	canViewApplicationCompletePageMiddleware,
	cleanupSessionJourneyMiddleware,
	hasApplicationBeenSubmittedMiddleware
} from './middleware/session.ts';
import {
	buildApplicationCompletePage,
	buildDeclarationPage,
	buildPositionInOrganisationPage,
	buildSavePositionInOrganisation,
	buildSubmitDeclaration
} from './declaration/controller.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const homePageController = buildHomePage(service);
	const signOutController = buildSignOutController(service);

	const positionInOrganisationPage = buildPositionInOrganisationPage();
	const savePositionInOrganisation = buildSavePositionInOrganisation(service);
	const declarationPage = buildDeclarationPage(service);
	const submitDeclaration = buildSubmitDeclaration(service);
	const applicationCompletePage = buildApplicationCompletePage(service);

	const whitelistMiddleware = buildWhitelistMiddleware(service);
	const cleanupSessionJourney = cleanupSessionJourneyMiddleware(service);
	const hasApplicationBeenSubmitted = hasApplicationBeenSubmittedMiddleware(service);
	const canViewApplicationCompletePage = canViewApplicationCompletePageMiddleware(service);

	router.get('/', cleanupSessionJourney, asyncHandler(homePageController));
	router.get('/sign-out', cleanupSessionJourney, asyncHandler(signOutController));

	router.get('/position-in-organisation', hasApplicationBeenSubmitted, asyncHandler(positionInOrganisationPage));
	router.post('/position-in-organisation', asyncHandler(savePositionInOrganisation));
	router.get('/declaration', hasApplicationBeenSubmitted, asyncHandler(declarationPage));
	router.post('/declaration', asyncHandler(submitDeclaration));
	router.get('/application-complete', canViewApplicationCompletePage, asyncHandler(applicationCompletePage));

	router.use('/manage-users', whitelistMiddleware, whitelistRoutes(service));

	//file-upload
	router.use(
		'/application-form-related-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.APPLICATION_FORM_RELATED_INFORMATION)
	);
	router.use('/plans-and-drawings', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.PLANS_AND_DRAWINGS));
	router.use('/draft-dco', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.DRAFT_DCO));
	router.use(
		'/compulsory-acquisition-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.COMPULSORY_ACQUISITION_INFORMATION)
	);
	router.use('/consultation-report', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.CONSULTATION_REPORT));
	router.use('/reports-and-statements', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.REPORTS_AND_STATEMENTS));
	router.use('/environmental-statement', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.ENVIRONMENTAL_STATEMENT));
	router.use(
		'/additional-prescribed-information',
		fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.ADDITIONAL_PRESCRIBED_INFORMATION)
	);
	router.use('/other-documents', fileUploadRoutes(service, DOCUMENT_CATEGORY_ID.OTHER));

	//application
	router.use(
		'/applicant-and-agent-details',
		applicantAgentDetailsRoutes(service, APPLICATION_SECTION_ID.APPLICANT_AND_AGENT_DETAILS)
	);
	router.use('/about-the-project', aboutTheProjectRoutes(service, APPLICATION_SECTION_ID.ABOUT_THE_PROJECT));
	router.use(
		'/consultation-and-publicity-details',
		consultationAndPublicityDetailsRoutes(service, APPLICATION_SECTION_ID.CONSULTATION_AND_PUBLICITY_DETAILS)
	);
	router.use(
		'/draft-order-and-explanatory-memorandum',
		draftOrderAndExplanatoryMemorandumRoutes(service, APPLICATION_SECTION_ID.DRAFT_ORDER_AND_EXPLANATORY_MEMORANDUM)
	);
	router.use('/land-and-works-plans', landAndWorksPlansRoutes(service, APPLICATION_SECTION_ID.LAND_AND_WORKS_PLANS));
	router.use(
		'/land-rights-information',
		landRightsInformationRoutes(service, APPLICATION_SECTION_ID.LAND_RIGHTS_INFORMATION)
	);
	router.use(
		'/habitat-regulations-assessment-information',
		habitatRegulationsAssessmentInformationRoutes(
			service,
			APPLICATION_SECTION_ID.HABITAT_REGULATIONS_ASSESSMENT_INFORMATION
		)
	);
	router.use(
		'/flood-risk-information',
		floodRiskInformationRoutes(service, APPLICATION_SECTION_ID.FLOOD_RISK_INFORMATION)
	);
	router.use(
		'/statutory-nuisance-information',
		statutoryNuisanceInformationRoutes(service, APPLICATION_SECTION_ID.STATUTORY_NUISANCE_INFORMATION)
	);
	router.use(
		'/nature-conservation-and-environmental-information',
		natureConservationAndEnvironmentInformationRoutes(
			service,
			APPLICATION_SECTION_ID.NATURE_CONSERVATION_AND_ENVIRONMENTAL_INFORMATION
		)
	);
	router.use(
		'/crown-land-access-and-rights-of-way-plans',
		crownLandAccessAndRightsOfWayPlansRoutes(service, APPLICATION_SECTION_ID.CROWN_LAND_ACCESS_AND_RIGHTS_OF_WAY_PLANS)
	);
	router.use(
		'/environmental-impact-assessment-information',
		environmentalImpactAssessmentInformationRoutes(
			service,
			APPLICATION_SECTION_ID.ENVIRONMENTAL_IMPACT_ASSESSMENT_INFORMATION
		)
	);
	router.use(
		'/other-plans-and-reports',
		otherPlansAndReportsRoutes(service, APPLICATION_SECTION_ID.OTHER_PLANS_AND_REPORTS)
	);
	router.use(
		'/other-consents-or-licences-details',
		otherConsentsOrLicencesRoutes(service, APPLICATION_SECTION_ID.OTHER_CONSENTS_OR_LICENCES_DETAILS)
	);
	router.use(
		'/infrastructure-specific-additional-information',
		infrastructureSpecificAdditionalInformationRoutes(
			service,
			APPLICATION_SECTION_ID.INFRASTRUCTURE_SPECIFIC_ADDITIONAL_INFORMATION
		)
	);

	return router;
}
