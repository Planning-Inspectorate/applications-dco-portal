/**
 * Load configuration for seeding the database
 */
export function loadConfig(): { db: string } {
	const connectionString = process.env.SQL_CONNECTION_STRING;
	if (!connectionString) {
		throw new Error('SQL_CONNECTION_STRING is required');
	}
	return {
		db: connectionString
	};
}
