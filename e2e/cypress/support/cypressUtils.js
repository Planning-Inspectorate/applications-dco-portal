import fs from 'fs-extra';
import path from 'path';

/**
 * Removes every file and directory from the downloads folder.
 *
 * @returns {null}
 */
export const deleteDownloads = () => {
	fs.removeSync(path.join(__dirname, `../downloads`));
	return null;
};

/**
 * Checks whether a file exists in the downloads folder.
 *
 * @param {string} fileName - The name of the file to check.
 * @returns {boolean} True when the file exists.
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
