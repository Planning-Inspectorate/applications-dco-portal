/**
 * Removes leading zeros from a numeric string, for example '00' becomes '0' and '05' becomes '5'.
 *
 * @param {*} value - The value to format.
 * @returns {string} The formatted value.
 */
export function formatAsWholeNumber(value) {
	// Remove any leading 0 (for example, from '00' or '05').
	return +value + '';
}

/**
 * Combines an object's values into a single string using the supplied separator.
 *
 * @param {*} object - An object containing address fields.
 * @param {*} seperator - The separator to use; defaults to an empty string.
 * @returns {string} The formatted string.
 */
export function formatObjectAsString(object, seperator = '') {
	cy.log('** object to format ', JSON.stringify(object));
	const formattedString = Object.keys(object)
		.map((key) => object[key])
		.join(seperator);

	return formattedString;
}

/**
 * Formats a Date object into a human-readable date and time.
 *
 * @param {Date} date - The date to format.
 * @param {boolean} isOrdinal - Whether to use ordinal format, such as a short month and 24-hour time.
 * @returns {Object} The formatted date and time.
 * @throws {Error} When an invalid date object is provided.
 */
export function formatDateAndTime(date, isOrdinal = false) {
	if (!(date instanceof Date)) {
		throw new Error('Invalid date object');
	}

	// Set format options based on ordinal flag
	const dateOptions = {
		day: 'numeric',
		month: isOrdinal ? 'short' : 'long',
		year: 'numeric'
	};

	const timeOptions = {
		hour: 'numeric',
		minute: 'numeric',
		hour12: !isOrdinal
	};

	// Format date (e.g., "22 May 2025" or "22 Oct 2025")
	const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);

	// Format time (e.g., "2:31am" or "14:31")
	const formattedTime = new Intl.DateTimeFormat('en-GB', timeOptions).format(date).toLowerCase().replace(' ', '');

	return { date: formattedDate, time: formattedTime };
}

/**
 * Gets the date and time values from a Date object.
 *
 * @param {*} date - The Date object to inspect.
 * @returns {{day: string, month: string, year: string, hours: string, minutes: string}} The date and time values.
 */
export function getDateAndTimeValues(date) {
	return {
		day: date.getDate() + '',
		month: date.getMonth() + 1 + '', // month is 0-11
		year: date.getFullYear() + '',
		hours: date.getHours() + '',
		minutes: date.getMinutes() + ''
	};
}

/**
 * Formats an input string in camel case.
 *
 * @param {string} input - The string to format.
 * @returns {string} The camel-cased value.
 */
export function formatAsCamelCase(input) {
	return input
		.trim()
		.split(/[\s-_]+/)
		.map((word, index) => {
			if (index === 0) return word.toLowerCase(); // First word is lowercase
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join('');
}
