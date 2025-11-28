import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  try {
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log("Tables:", result.map(r => r.table_name));

    const columns = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'value_categories'
    `);
    console.log("ValueCategories Columns:", columns.map(c => c.column_name));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

main();
