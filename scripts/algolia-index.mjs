import fs from 'fs/promises';
import path from 'path';
import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const APP_ID = process.env.ALGOLIA_APP_ID;
const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY; // Write key (Admin key)
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

async function main() {
  const missing = [
    ['ALGOLIA_APP_ID', APP_ID],
    ['ALGOLIA_ADMIN_API_KEY', ADMIN_API_KEY],
    ['ALGOLIA_INDEX_NAME', INDEX_NAME],
  ].filter(([, v]) => !v);
  if (missing.length) {
    console.log('[algolia-index] Skip indexing. Missing env:', missing.map(([k]) => k).join(', '));
    return;
  }

  const client = algoliasearch(APP_ID, ADMIN_API_KEY);
  const index = client.initIndex(INDEX_NAME);

  const jsonPath = path.join(process.cwd(), 'public', 'index.json');
  const raw = await fs.readFile(jsonPath, 'utf-8').catch(() => null);
  if (!raw) {
    console.error(`[algolia-index] Cannot find ${jsonPath}. Ensure Hugo built JSON output.`);
    process.exit(0);
  }

  let records = [];
  try {
    records = JSON.parse(raw);
  } catch (e) {
    console.error('[algolia-index] Failed to parse public/index.json:', e.message);
    process.exit(1);
  }

  if (!Array.isArray(records)) {
    console.error('[algolia-index] public/index.json is not an array.');
    process.exit(1);
  }

  // Ensure objectID exists
  records = records.map((r, i) => ({ objectID: r.objectID || r.permalink || String(i), ...r }));

  console.log(`[algolia-index] Pushing ${records.length} records to index ${INDEX_NAME} ...`);
  // Replace all objects each build for simplicity
  await index.replaceAllObjects(records, { autoGenerateObjectIDIfNotExist: true });
  console.log('[algolia-index] Done.');
}

main().catch((err) => {
  console.error('[algolia-index] Fatal error:', err);
  process.exit(1);
});
