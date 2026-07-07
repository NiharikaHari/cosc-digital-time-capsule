import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "db.json");

mkdirSync(dataDir, { recursive: true });

const defaultData = { capsules: [] };

export const db = await JSONFilePreset(dbFile, defaultData);
