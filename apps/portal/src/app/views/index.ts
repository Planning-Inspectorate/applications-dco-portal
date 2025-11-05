import type { IRouter } from 'express';
import { Router as createRouter } from 'express';
import { createRoutes as fileUploadRoutes } from './file-upload/index.ts';
import { createRoutes as applicantAgentDetailsRoutes } from './applicant-agent-details/index.ts';
import { PortalService } from '#service';
import { DOCUMENT_CATEGORY_ID } from '@pins/dco-portal-database/src/seed/data-static.ts';
import { APPLICATION_SECTION_ID } from './constants.ts';
import { buildHomePage } from './home/controller.ts';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';

export function createRoutes(service: PortalService): IRouter {
	const router = createRouter({ mergeParams: true });

	const homePageController = buildHomePage(service);

	router.get('/', asyncHandler(homePageController));

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

	return router;
}
