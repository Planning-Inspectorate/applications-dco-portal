/**
 * @typedef {object} DocumentCategory
 * @property {string} name - Human-readable category name used in the test title.
 * @property {number} index - Zero-based position in the application task list.
 * @property {string} fragment - Route fragment for the document category.
 */

/**
 * Document categories used by the upload end-to-end journeys.
 *
 * @type {DocumentCategory[]}
 */
const DOCUMENT_CATEGORIES = [
	{
		name: 'Application form related information',
		index: 0,
		fragment: '/application-form-related-information'
	},
	{ name: 'Plans and drawings', index: 1, fragment: '/plans-and-drawings' },
	{ name: 'Draft DCO', index: 2, fragment: '/draft-dco' },
	{
		name: 'Compulsory acquisition information',
		index: 3,
		fragment: '/compulsory-acquisition-information'
	},
	{ name: 'Newspaper notices', index: 4, fragment: '/newspaper-notices' },
	{ name: 'Reports and statements', index: 5, fragment: '/reports-and-statements' },
	{ name: 'Environmental statement', index: 6, fragment: '/environmental-statement' },
	{
		name: 'Additional prescribed information (optional)',
		index: 7,
		fragment: '/additional-prescribed-information'
	},
	{ name: 'Other documents (optional)', index: 8, fragment: '/other-documents' }
];

/**
 * File fixtures used to check which upload extensions are supported.
 *
 * Each fixture label is used in the generated test title, and its file path is
 * passed to Cypress's file upload command.
 *
 * @type {{label: string, file: string}[]}
 */
const ALLOWED_FILE_TYPES = [
	{ label: 'PDF', file: 'cypress/fixtures/uploadTest.pdf' },
	{ label: 'PNG', file: 'cypress/fixtures/uploadTest.png' },
	{ label: 'JPG', file: 'cypress/fixtures/uploadTest.jpg' },
	{ label: 'JPEG', file: 'cypress/fixtures/uploadTest.jpeg' },
	{ label: 'DOCX', file: 'cypress/fixtures/uploadTest.docx' },
	{ label: 'DOC', file: 'cypress/fixtures/uploadTest.doc' },
	{ label: 'XLSX', file: 'cypress/fixtures/uploadTest.xlsx' },
	{ label: 'XLS', file: 'cypress/fixtures/uploadTest.xls' },
	{ label: 'TIFF', file: 'cypress/fixtures/uploadTest.tiff' },
	{ label: 'TIF', file: 'cypress/fixtures/uploadTest.tif' }
];

export { ALLOWED_FILE_TYPES, DOCUMENT_CATEGORIES };
