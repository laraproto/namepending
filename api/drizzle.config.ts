import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/modules/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: process.env.DATABASE_URL!
		? {
				url: process.env.DATABASE_URL!
			}
		: {
				host: process.env.PGHOST!,
				user: process.env.PGUSER!,
				database: process.env.PGDATABASE!,
				ssl: false
			}
});
