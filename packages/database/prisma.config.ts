import { defineConfig } from 'prisma/config';
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (two levels up from packages/database)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
	schema: path.join('src', 'schema.prisma'),
	migrations: {
		path: path.join('src', 'migrations'),
		seed: 'tsx src/seed/seed-dev.ts'
	}
});
