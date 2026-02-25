const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../tracker.db');
const db = new Database(dbPath);

const newColumns = [
  // Pack contents checklist
  { name: 'pack_nomination_papers', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_guidance_notes', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_expenses_forms', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_code_of_conduct', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_voter_id_briefing', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'pack_canvassing_rules', type: 'INTEGER NOT NULL DEFAULT 0' },
  // Nomination details (extends existing proposer/seconder/consent_signed/nomination_submitted)
  { name: 'assenters_count', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'assenters_names', type: "TEXT NOT NULL DEFAULT ''" },
  { name: 'on_electoral_register', type: 'INTEGER NOT NULL DEFAULT 0' },
  { name: 'party_authorised', type: 'INTEGER NOT NULL DEFAULT 0' },
  // Contact
  { name: 'email', type: "TEXT NOT NULL DEFAULT ''" },
  { name: 'phone', type: "TEXT NOT NULL DEFAULT ''" },
  // Briefing
  { name: 'briefing_scheduled', type: "TEXT NOT NULL DEFAULT ''" },
  { name: 'briefing_completed', type: 'INTEGER NOT NULL DEFAULT 0' },
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
