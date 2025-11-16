import {Database} from "bun:sqlite";
import {drizzle} from "drizzle-orm/bun-sqlite";
import {env} from "@/env.js";
import schema from "./schema/index.js";

const sqlite = new Database(env.DATABASE_URL);

export const db = drizzle({client: sqlite, schema});

db.run("PRAGMA journal_mode = WAL;");
