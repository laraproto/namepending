import { drizzle } from 'drizzle-orm/bun-sql';
import { building } from '$app/environment';
import { migrate } from 'drizzle-orm/bun-sql/migrator';
import { sql } from 'bun';
import { DRIZZLE_MIGRATION_DIR } from '$app/env/private';
import * as path from 'node:path';
import * as schema from './schema';

const db = drizzle({ client: sql, schema });

if (!building) { await migrate(db, { migrationsFolder: DRIZZLE_MIGRATION_DIR ?? path.join(import.meta.dirname, '../../../../drizzle') }) }

export { schema };

export default db;
