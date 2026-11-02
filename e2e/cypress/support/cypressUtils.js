/**
 * @file File system utility functions for managing downloaded files in Cypress tests.
 * @module support/cypressUtils
 *
 * This module provides file helper functions for Cypress Node tasks.
 * It handles the creation, inspection, and deletion of downloaded files.
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Deletes all files and subdirectories in the downloads directory.
 *
 * @returns {null} Always returns null to satisfy the Cypress task interface.
 */
export const deleteDownloads = () => {
	fs.removeSync(path.join(__dirname, `../downloads`));
	return null;
};

/**
 * Validates that a file exists in the downloads directory.
 *
 * @param {string} fileName - The name of the expected file.
 * @returns {boolean} True when the file exists and is a regular file. Otherwise false.
 */
export const validateDownloadedFile = (fileName) => {
	const downloadsPath = path.join(__dirname, `../downloads`);
	const filePath = path.join(downloadsPath, fileName);

	try {
		const stats = fs.statSync(filePath);
		return stats.isFile();
	} catch {
		return false;
	}
};
