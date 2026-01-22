import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * @returns html with added css if <head> valid, otherwise returns unedited html passed in
 */
export const addCSStoHtml = async (html: string, stylesheetName: string): Promise<string> => {
	const htmlArray = html.split('<head>');
	if (htmlArray.length !== 2) return html;

	const currentPath = path.dirname(fileURLToPath(import.meta.url));
	const cssFilePath = path.join(currentPath, '../pdf-service/stylesheets', stylesheetName);
	console.log(currentPath);
	console.log(cssFilePath);
	const css = await fs.promises.readFile(cssFilePath, 'utf8');

	return htmlArray[0] + `<head><style>${css}</style>` + htmlArray[1];
};
