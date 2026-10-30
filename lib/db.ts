import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
const globalDb = globalThis as unknown as { civicPool?: Pool };
export function db() {
  if(!process.env.DATABASE_URL) throw new Error("Database is not configured");
  if(!globalDb.civicPool) {
    globalDb.civicPool = new Pool({connectionString:process.env.DATABASE_URL,max:4,idleTimeoutMillis:10000,connectionTimeoutMillis:10000,query_timeout:15000,statement_timeout:12000});
    attachDatabasePool(globalDb.civicPool);
  }
  return globalDb.civicPool;
}
