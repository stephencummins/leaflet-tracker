const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../tracker.db');
const db = new Database(dbPath);

// v4: Track candidate signatures on emblem request (form 3) and agent notification (form 4)
const newColumns = [
  { name: 'emblem_request_signed', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'agent_notification_signed', type: 'INTEGER NOT NULL DEFAULT 0' },
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
