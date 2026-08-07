import { drizzle } from 'drizzle-orm/bun-sql';
import { sql } from 'bun';
import * as schema from './schema';

const db = drizzle({ client: sql, schema });

export { schema };

export default db;
