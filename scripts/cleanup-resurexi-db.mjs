/**
 * Removes failed portfolio migration artifacts from `public` schema.
 * Usage: node scripts/cleanup-resurexi-db.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key] || key === "POSTGRES_URL") process.env[key] = val;
    }
  } catch {
    // .env optional if POSTGRES_URL already exported
  }
}

loadEnv();

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL is required");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });

const publicT3tmpTables = [
  "_t3tmp_blog_post",
  "_t3tmp_category",
  "_t3tmp_contact_link",
  "_t3tmp_contact_request",
  "_t3tmp_site_content",
  "_t3tmp_work_category",
  "_t3tmp_work_gallery_image",
  "_t3tmp_work_youtube_video",
  "_t3tmp_work",
];

for (const table of publicT3tmpTables) {
  await sql.unsafe(`DROP TABLE IF EXISTS public."${table}" CASCADE`);
  console.log(`dropped public.${table} (if existed)`);
}

await sql.unsafe(`DROP TYPE IF EXISTS public."site_content_key" CASCADE`);
console.log("dropped public.site_content_key (if existed)");

await sql.unsafe(`DROP SCHEMA IF EXISTS resurexi CASCADE`);
console.log("dropped schema resurexi (if existed)");

await sql.end();
console.log("Done.");
