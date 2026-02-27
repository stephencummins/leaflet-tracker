const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../tracker.db');
const db = new Database(dbPath);

// v3: Replace pack-based checklist with SAM's 7 nomination steps
const newColumns = [
  { name: 'nomination_paper', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'home_address_form', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'certificate_of_authorisation', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'emblem_request', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'agent_appointment', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'proposer_seconder_confirmed', type: 'INTEGER NOT NULL DEFAULT 0' },
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
