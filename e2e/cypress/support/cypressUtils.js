import fs from 'fs-extra';
import path from 'path';

/**
 * Deletes all files and directories in the 'downloads' directory.
 * @returns {null}
 */
export const deleteDownloads = () => {
	fs.removeSync(path.join(__dirname, `../downloads`));
	return null;
};

/**
 * Checks if a file exists in the downloads folder.
 *  * @param {string} fileName - The user ID to check for.
 * @returns {boolean}
 */
export const validateDownloadedFile = (fileName) => {
	const downloadsPath = path.join(__dirname, `../downloads`);
	const filePath = path.join(downloadsPath, fileName);

	try {
		const stats = fs.statSync(filePath);
		return stats.isFile();
	} catch (err) {
		return false;
	}
};
