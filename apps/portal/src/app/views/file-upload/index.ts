import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/dco-portal-lib/util/async-handler.ts';
import type { PortalService } from '#service';
import type { IRouter } from 'express';
import {
	buildDeleteDocumentAndSaveController,
	buildDownloadDocumentController,
	buildFileUploadHomePage
} from './controller.ts';
import { uploadDocumentQuestion } from './middleware.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { buildGetJourney } from '@planning-inspectorate/dynamic-forms/src/middleware/build-get-journey.js';
import {
	saveDataToSession,
	buildGetJourneyResponseFromSession
	// @ts-expect-error - due to not having @types
} from '@planning-inspectorate/dynamic-forms/src/lib/session-answer-store.js';
// @ts-expect-error - due to not having @types
import { list, question, buildSave } from '@planning-inspectorate/dynamic-forms/src/controller.js';
// @ts-expect-error - due to not having @types
import validate from '@planning-inspectorate/dynamic-forms/src/validator/validator.js';
// @ts-expect-error - due to not having @types
import { validationErrorHandler } from '@planning-inspectorate/dynamic-forms/src/validator/validation-error-handler.js';
import type { Handler, Request } from 'express';
import { getDocumentCategoryDisplayName, buildIsTaskCompleted } from '../util.ts';
import { buildSaveController } from './save.ts';
import multer from 'multer';
import {
	deleteDocumentsController,
	uploadDocumentsController
} from '@pins/dco-portal-lib/forms/custom-components/file-upload/upload-documents.ts';
import {
	ALLOWED_EXTENSIONS,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE
} from '@pins/dco-portal-lib/forms/custom-components/file-upload/constants.ts';

export function createRoutes(service: PortalService, documentTypeId: string): IRouter {
	const router = createRouter({ mergeParams: true });
	const questions = getQuestions(documentTypeId);
	const getJourney = buildGetJourney((req: Request, journeyResponse: Handler) =>
		createJourney(documentTypeId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(documentTypeId);

	const fileUploadHomePage = buildFileUploadHomePage(service, documentTypeId);
	const isFileUploadSectionCompleted = buildIsTaskCompleted(service, documentTypeId, buildFileUploadHomePage);
	const saveController = buildSaveController(service, documentTypeId);
	const downloadDocumentController = buildDownloadDocumentController(service);
	const deleteDocumentAndSaveController = buildDeleteDocumentAndSaveController(service, documentTypeId);

	const handleUploads = multer();
	const uploadDocuments = asyncHandler(
		uploadDocumentsController(service, documentTypeId, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE)
	);
	const deleteDocuments = asyncHandler(deleteDocumentsController(service, documentTypeId));

	router.get('/', asyncHandler(fileUploadHomePage));
	router.post('/', asyncHandler(isFileUploadSectionCompleted));

	router.get('/document/download/:documentId', asyncHandler(downloadDocumentController));
	router.get('/document/delete/:documentId', asyncHandler(deleteDocumentAndSaveController));

	router.get('/:section/:question', getJourneyResponse, getJourney, uploadDocumentQuestion, question);

	router.post(
		'/:section/:question',
		getJourneyResponse,
		getJourney,
		validate,
		validationErrorHandler,
		buildSave(saveDataToSession)
	);

	router.post(
		'/:section/:question/upload',
		getJourneyResponse,
		getJourney,
		handleUploads.array('files[]'),
		uploadDocuments
	);

	router.post('/:section/:question/delete/:documentId', getJourneyResponse, getJourney, deleteDocuments);

	router.get('/check-your-answers', getJourneyResponse, getJourney, (req, res) =>
		list(req, res, getDocumentCategoryDisplayName(documentTypeId), {
			pageHeading: 'Check your answers before uploading your document(s)',
			submitButtonText: 'Confirm upload'
		})
	);

	router.post('/check-your-answers', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
