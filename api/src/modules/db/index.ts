import { drizzle } from 'drizzle-orm/bun-sql';
import { sql } from 'bun';
import * as schema from './schema';

const db = drizzle({ client: sql, schema });

db.insert(schema.config).values({});

export { schema };

export default db;
