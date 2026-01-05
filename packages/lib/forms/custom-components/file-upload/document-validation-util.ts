import * as CFB from 'cfb';
import { fileTypeFromBuffer } from 'file-type';
import { PDFDocument } from 'pdf-lib';
import type { Logger } from 'pino';
import { ALLOWED_EXTENSIONS_TEXT } from './constants.ts';
import path from 'path';

export async function validateUploadedFile(
	file: Express.Multer.File,
	logger: Logger,
	allowedFileExtensions: string[],
	allowedMimeTypes: string[],
	maxFileSize: number
) {
	let validationErrors = [];
	const { originalname, mimetype, buffer, size } = file;

	if (typeof size !== 'number' || size <= 0) {
		validationErrors.push({
			text: `${originalname}: The attachment is empty`,
			href: '#upload-form'
		});
		return validationErrors;
	}

	if (originalname.length > 255) {
		validationErrors.push({
			text: `${originalname}: The attachment name exceeds the 255 character limit`,
			href: '#upload-form'
		});
	}

	if (originalname.includes('–') || originalname.includes('—')) {
		validationErrors.push({
			text: `${originalname}: The attachment name contains special characters '-' or '_'. Please remove these and try again.`,
			href: '#upload-form'
		});
	}

	if (!allowedMimeTypes.includes(mimetype)) {
		validationErrors.push({
			text: `${originalname}: The attachment must be ${ALLOWED_EXTENSIONS_TEXT}`,
			href: '#upload-form'
		});
	}

	if (size > maxFileSize) {
		validationErrors.push({
			text: `${originalname}: The attachment must be smaller than 250MB`,
			href: '#upload-form'
		});
		return validationErrors;
	}

	const declaredExt: string = path.extname(file.originalname).slice(1).toLowerCase();
	if (['html', 'prj', 'gis', 'dbf', 'shp', 'shx'].includes(declaredExt)) {
		const text: string = file.buffer.toString('utf8', 0, 200).trim();
		const header: string = file.buffer.subarray(0, 8).toString('hex').toUpperCase();

		if (
			declaredExt === 'html' &&
			!text.toLowerCase().includes('<html') &&
			!text.toLowerCase().includes('<!doctype html')
		) {
			validationErrors.push({
				text: `${originalname}: The attachment is not a valid .html file`,
				href: '#upload-form'
			});
		}

		if (declaredExt === 'prj' && !(text.startsWith('PROJCS[') || text.startsWith('GEOGCS['))) {
			validationErrors.push({
				text: `${originalname}: The attachment is not a valid .prj file`,
				href: '#upload-form'
			});
		}

		if (declaredExt === 'gis' && !/coordinate|longitude|latitude/i.test(text)) {
			validationErrors.push({
				text: `${originalname}: The attachment is not a valid .gis file`,
				href: '#upload-form'
			});
		}

		if (declaredExt === 'dbf' && !['03', '83', '8B', '8E'].includes(header.slice(0, 2))) {
			validationErrors.push({
				text: `${originalname}: The attachment is not a valid .dbf file`,
				href: '#upload-form'
			});
		}

		if ((declaredExt === 'shp' || declaredExt === 'shx') && !header.startsWith('0000270A')) {
			validationErrors.push({
				text: `${originalname}: The attachment is not a valid .shp or .shx file`,
				href: '#upload-form'
			});
		}
		return validationErrors;
	}

	const fileTypeResult = await fileTypeFromBuffer(buffer);

	if (!fileTypeResult) {
		validationErrors.push({
			text: `${originalname}: Could not determine file type from signature`,
			href: '#upload-form'
		});
		return validationErrors;
	}

	const { mime, ext } = fileTypeResult;

	if ((ext === 'pdf' || mime === 'application/pdf') && (await isPdfPasswordProtected(buffer, logger))) {
		validationErrors.push({
			text: `${originalname}: File must not be password protected`,
			href: '#upload-form'
		});
	}

	// Compound File Binary (.cfb) is a Microsoft file container format that acts like a mini filesystem inside a file
	// common users include older Microsoft Office files such as .doc and .xls
	if ((ext === 'cfb' || mime === 'application/x-cfb') && isDocOrXlsEncrypted(buffer, logger)) {
		validationErrors.push({
			text: `${originalname}: File must not be password protected`,
			href: '#upload-form'
		});
	}

	// this check is to prevent file spoofing and checks the parsed result returned from file-type library
	if (
		fileTypeResult &&
		allowedMimeTypes.includes(mimetype) &&
		(!new Set([...allowedMimeTypes, 'application/x-cfb']).has(mime) ||
			!new Set([...allowedFileExtensions, 'cfb']).has(ext))
	) {
		const declaredExt = mimetype.split('/')[1];
		validationErrors.push({
			text: `${originalname}: File signature mismatch: declared as .${declaredExt} (${mimetype}) but detected as .${ext} (${mime})`,
			href: '#upload-form'
		});
	}

	if (ext === 'zip' || mime === 'application/zip') {
		// reset validation errors if zip file is detected
		// zip files are not allowed, so we add a specific error message
		validationErrors = [];
		validationErrors.push({
			text: `${originalname}: The attachment must not be a zip file`,
			href: '#upload-form'
		});
	}

	return validationErrors;
}

async function isPdfPasswordProtected(buffer: Buffer, logger: Logger) {
	try {
		await PDFDocument.load(buffer);
		return false;
	} catch (err) {
		logger.warn({ err }, `PDF document is password protected`);
		return true;
	}
}

export function isDocOrXlsEncrypted(buffer: Buffer, logger: Logger) {
	try {
		const container = CFB.parse(buffer, { type: 'buffer' });

		// Word: Check fEncrypted flag in WordDocument stream at offset 0x0B
		const wordEntry = container.FileIndex.find((entry) => entry.name === 'WordDocument');
		if (wordEntry && wordEntry.content && wordEntry.content.length > 0x0b) {
			const fEncrypted = (wordEntry.content[0x0b] & 0x01) === 0x01;
			if (fEncrypted) return true;
		}

		// Excel: Look for "FILEPASS" record (0x002F) at the beginning of Workbook stream
		const workbookEntry = container.FileIndex.find((entry) => entry.name === 'Workbook');
		if (workbookEntry && workbookEntry.content) {
			const contentBuffer = Buffer.from(workbookEntry.content);
			if (hasFilePassRecord(contentBuffer)) {
				return true;
			}
		}

		// Also check for encrypted streams
		const hasEncryptedStream = container.FileIndex.some((entry) =>
			['encryptedstream', 'encryptedpackage', 'encryptioninfo'].includes(entry.name?.toLowerCase())
		);

		return hasEncryptedStream;
	} catch (err) {
		logger.error({ err }, `error parsing .doc or .xls file`);
		// If parsing fails, we assume file might be encrypted or corrupt
		return true;
	}
}

function hasFilePassRecord(buffer: Buffer) {
	let offset = 0;
	while (offset + 4 < buffer.length) {
		const recordType = buffer.readUInt16LE(offset);
		const recordLength = buffer.readUInt16LE(offset + 2);

		if (recordType === 0x002f) {
			// FILEPASS found - file is password protected
			return true;
		}

		offset += 4 + recordLength;
	}
	return false;
}
