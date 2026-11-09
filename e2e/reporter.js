const fs = require('fs');
const path = require('path');

let report;
try {
	report = require('multiple-cucumber-html-reporter');
} catch (error) {
	if (
		error &&
		error.code === 'MODULE_NOT_FOUND' &&
		typeof error.message === 'string' &&
		error.message.includes('multiple-cucumber-html-reporter')
	) {
		console.warn('Skipping Cypress HTML report generation: multiple-cucumber-html-reporter is not installed');
		process.exit(0);
	}

	throw error;
}

const jsonDir = path.resolve(__dirname, 'cypress/cucumber-json');
const reportPath = path.resolve(__dirname, 'cypress/cucumber-report');

const hasReadableJsonResults = () => {
	if (!fs.existsSync(jsonDir)) {
		return false;
	}

	try {
		return fs
			.readdirSync(jsonDir, { withFileTypes: true })
			.some((entry) => entry.isFile() && entry.name.endsWith('.json'));
	} catch (error) {
		console.warn(`Skipping Cypress HTML report generation: unable to read ${jsonDir}`, error);
		return false;
	}
};

if (!hasReadableJsonResults()) {
	console.warn(`Skipping Cypress HTML report generation: no cucumber JSON files found in ${jsonDir}`);
	process.exit(0);
}

try {
	report.generate({
		jsonDir,
		reportPath
	});
} catch (error) {
	console.warn('Skipping Cypress HTML report generation due to reporter error', error);
	process.exit(0);
}
