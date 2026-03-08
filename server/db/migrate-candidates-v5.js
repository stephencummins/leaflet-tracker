const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../tracker.db');
const db = new Database(dbPath);

// v5: Simplified nomination checklist — 6 clear steps replacing the old 8-step paperwork fields
const newColumns = [
  { name: 'pack_printed_sent', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_precompleted', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_printed', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_sent', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'signed_witnessed', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'proposed_seconded', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'collected', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'checked_by_scc', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'submitted', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'briefing_na', type: 'INTEGER NOT NULL DEFAULT 0' },
];

const existing = db.prepare("PRAGMA table_info(candidates)").all().map(c => c.name);

let added = 0;
for (const col of newColumns) {
  if (existing.includes(col.name)) {
    console.log(`  ✓ ${col.name} already exists`);
    continue;
  }
  db.prepare(`ALTER TABLE candidates ADD COLUMN ${col.name} ${col.type}`).run();
  console.log(`  + Added ${col.name}`);
  added++;
}

console.log(`\nMigration complete: ${added} columns added, ${newColumns.length - added} already existed.`);
db.close();
