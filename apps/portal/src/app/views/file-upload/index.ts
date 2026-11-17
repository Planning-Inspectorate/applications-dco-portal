import { Router as createRouter } from 'express';
import { buildCsrfMiddleware } from '@planning-inspectorate/core';
import { asyncHandler } from '@planning-inspectorate/core/util';
import type { PortalService } from '#service';
import type { IRouter } from 'express';
import {
	buildDeleteDocumentAndSaveController,
	buildDownloadDocumentController,
	buildFileUploadHomePage,
	isFileUploadSectionCompletedController
} from './controller.ts';
import { uploadDocumentQuestion } from '../middleware/file-upload-middleware.ts';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
import {
	buildGetJourney,
	buildGetJourneyResponseFromSession,
	buildSave,
	list,
	question,
	saveDataToSession,
	validate,
	validationErrorHandler
} from '@planning-inspectorate/dynamic-forms';
import { getDocumentCategoryDisplayName } from '../util.ts';
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
	const getJourney = buildGetJourney((req, journeyResponse) =>
		createJourney(documentTypeId, questions, journeyResponse, req)
	);
	const getJourneyResponse = buildGetJourneyResponseFromSession(documentTypeId);

	const fileUploadHomePage = buildFileUploadHomePage(service, documentTypeId);
	const isFileUploadSectionCompleted = isFileUploadSectionCompletedController(service, documentTypeId);
	const saveController = buildSaveController(service, documentTypeId);
	const downloadDocumentController = buildDownloadDocumentController(service);
	const deleteDocumentAndSaveController = buildDeleteDocumentAndSaveController(service, documentTypeId);

	const handleUploads = multer();
	const validateMultipartUploadCsrf = buildCsrfMiddleware([], []);
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
		validateMultipartUploadCsrf,
		uploadDocuments
	);

	router.post('/:section/:question/delete/:documentId', getJourneyResponse, getJourney, deleteDocuments);

	router.get('/check-your-answers', getJourneyResponse, getJourney, (req, res) =>
		list(req, res, getDocumentCategoryDisplayName(documentTypeId), {
			pageHeading: 'Check your answers before uploading your documents',
			submitButtonText: 'Confirm upload'
		})
	);

	router.post('/check-your-answers', getJourneyResponse, getJourney, asyncHandler(saveController));

	return router;
}
