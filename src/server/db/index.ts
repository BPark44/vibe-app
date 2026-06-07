import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import type { DB } from "./types";

// Reuse the pg Pool across hot reloads in development so we don't exhaust
// connections. In production a single module instance is created per server.
const globalForDb = globalThis as unknown as { __pgPool?: Pool };

const pool =
  globalForDb.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgPool = pool;
}

/**
 * Type-safe Kysely query builder bound to the Supabase Postgres database.
 * Table/column types come from `./types`, generated from the Prisma schema.
 */
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});

export type Database = DB;
