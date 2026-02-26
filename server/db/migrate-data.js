/**
 * One-shot migration script to update the running SQLite database
 * to match the corrected seed data (Feb 10 — Granville round fix).
 *
 * Run with: node server/db/migrate-data.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'tracker.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function log(msg) {
  console.log(`[migrate] ${msg}`);
}

const migrate = db.transaction(() => {
  // ── 1. Add new columns if missing ──────────────────────────────
  const streetCols = db.prepare("PRAGMA table_info(streets)").all().map(c => c.name);
  if (!streetCols.includes('latitude')) {
    db.exec('ALTER TABLE streets ADD COLUMN latitude REAL');
    log('Added latitude column to streets');
  }
  if (!streetCols.includes('longitude')) {
    db.exec('ALTER TABLE streets ADD COLUMN longitude REAL');
    log('Added longitude column to streets');
  }

  const volCols = db.prepare("PRAGMA table_info(volunteers)").all().map(c => c.name);
  if (!volCols.includes('phone')) {
    db.exec('ALTER TABLE volunteers ADD COLUMN phone TEXT');
    log('Added phone column to volunteers');
  }

  if (!volCols.includes('notes')) {
    db.exec('ALTER TABLE volunteers ADD COLUMN notes TEXT');
    log('Added notes column to volunteers');
  }

  // ── 2. Register volunteers ─────────────────────────────────────
  const insertVol = db.prepare('INSERT OR IGNORE INTO volunteers (name) VALUES (?)');
  for (const name of ['Chris Hind', 'Martha', 'Cavan']) {
    const r = insertVol.run(name);
    if (r.changes) log(`Registered volunteer: ${name}`);
  }

  // Set Chris Hind's notes
  db.prepare("UPDATE volunteers SET notes = ? WHERE name = 'Chris Hind'")
    .run('Also delivered Elm Road, Leigh Hall Road, Leighton Avenue & Oakleigh Park Drive in Blenheim Park area');
  log("Set Chris Hind's Blenheim Park footnote");

  // Helpers
  const getVol = db.prepare('SELECT id FROM volunteers WHERE name = ?');
  const getStreet = db.prepare('SELECT id, house_count, is_complete, completed_by FROM streets WHERE name = ? AND zone_id = ?');
  const markComplete = db.prepare(
    "UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = ? WHERE id = ?"
  );
  const unDeliver = db.prepare(
    'UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL WHERE id = ?'
  );
  const insertLog = db.prepare(
    'INSERT INTO delivery_log (street_id, volunteer_id, house_count) VALUES (?, ?, ?)'
  );

  const granvilleId = getVol.get('Granville Stride')?.id;
  const robertId = getVol.get('Robert Howes')?.id;
  const marthaId = getVol.get('Martha')?.id;
  const cavanId = getVol.get('Cavan')?.id;

  // ── 3. Fix Granville's round: these 9 streets are his ─────────
  const granvilleStreets = [
    'Dundonald Drive',
    'Highcliff Drive',
    'Hillside Crescent',
    'Leigh Road',
    'London Road',
    'Somerville Gardens / Carlton Drive / Nelson Drive',
    'Woodfield Gardens',
    'Woodfield Park Drive',
    'Woodfield Road / Glen Road',
  ];

  for (const streetName of granvilleStreets) {
    const street = getStreet.get(streetName, 'WJZ');
    if (!street) continue;

    if (street.is_complete && street.completed_by === granvilleId) {
      // Already correctly assigned
      continue;
    }

    if (street.is_complete) {
      // Reassign from whoever currently has it to Granville
      db.prepare('UPDATE streets SET completed_by = ? WHERE id = ?').run(granvilleId, street.id);
      db.prepare('UPDATE delivery_log SET volunteer_id = ? WHERE street_id = ?').run(granvilleId, street.id);
      log(`Reassigned ${streetName} (WJZ) -> Granville Stride`);
    } else {
      // Not yet delivered — mark as delivered by Granville
      markComplete.run(granvilleId, street.id);
      insertLog.run(street.id, granvilleId, street.house_count);
      log(`Marked ${streetName} (WJZ) as delivered by Granville Stride`);
    }
  }

  // ── 4. Un-deliver the 6 streets that aren't Granville's ───────
  const notGranville = [
    'Chalkwell Park Drive',
    'Cliffsea Grove',
    'Grand Drive (even only)',
    'Grand Parade',
    'Marguerite Drive',
    'Portchester Court',
  ];

  for (const streetName of notGranville) {
    const street = getStreet.get(streetName, 'WJZ');
    if (street && street.is_complete) {
      unDeliver.run(street.id);
      db.prepare('DELETE FROM delivery_log WHERE street_id = ?').run(street.id);
      log(`Un-delivered ${streetName} (WJZ)`);
    }
  }

  // ── 5. Other WJZ assignments (Martha, Cavan) ──────────────────
  const otherAssignments = [
    { street: 'Leighcliff Road / Maple Avenue / Victor Drive', zone: 'WJZ', volId: marthaId, volName: 'Martha' },
    { street: 'Lord Roberts Avenue', zone: 'WJZ', volId: cavanId, volName: 'Cavan' },
  ];

  for (const a of otherAssignments) {
    const street = getStreet.get(a.street, a.zone);
    if (!street) continue;

    if (street.is_complete) {
      if (street.completed_by !== a.volId) {
        db.prepare('UPDATE streets SET completed_by = ? WHERE id = ?').run(a.volId, street.id);
        db.prepare('UPDATE delivery_log SET volunteer_id = ? WHERE street_id = ?').run(a.volId, street.id);
        log(`Reassigned ${a.street} -> ${a.volName}`);
      }
    } else {
      markComplete.run(a.volId, street.id);
      insertLog.run(street.id, a.volId, street.house_count);
      log(`Marked ${a.street} as delivered by ${a.volName}`);
    }
  }

  // ── 6. Remove WOZ deliveries (all Robert Howes) ────────────────
  const wozStreets = db.prepare("SELECT id, name FROM streets WHERE zone_id = 'WOZ' AND is_complete = 1").all();
  for (const s of wozStreets) {
    unDeliver.run(s.id);
    db.prepare('DELETE FROM delivery_log WHERE street_id = ?').run(s.id);
    log(`Un-delivered ${s.name} (WOZ)`);
  }

  // ── 7. Chris Hind's Blenheim Park extra houses ─────────────────
  const chrisId = getVol.get('Chris Hind').id;
  let blenheimStreet = db.prepare("SELECT id FROM streets WHERE name = 'Blenheim Park (extra)' AND zone_id = 'WJZ'").get();
  if (!blenheimStreet) {
    const totalBlenheim = 510; // Elm Road 140 + Leigh Hall Road 120 + Leighton Avenue 115 + Oakleigh Park Drive 135
    db.prepare("INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Blenheim Park (extra)', ?, 1, datetime('now'), ?)")
      .run(totalBlenheim, chrisId);
    blenheimStreet = db.prepare("SELECT id FROM streets WHERE name = 'Blenheim Park (extra)' AND zone_id = 'WJZ'").get();
    insertLog.run(blenheimStreet.id, chrisId, totalBlenheim);
    log(`Added Blenheim Park (extra) street with ${totalBlenheim} houses for Chris Hind`);
  }

  // ── 8. Summary ─────────────────────────────────────────────────
  const total = db.prepare('SELECT SUM(house_count) as t FROM streets').get().t;
  const delivered = db.prepare('SELECT SUM(house_count) as t FROM streets WHERE is_complete = 1').get().t;
  const streetsDone = db.prepare('SELECT COUNT(*) as c FROM streets WHERE is_complete = 1').get().c;
  const totalStreets = db.prepare('SELECT COUNT(*) as c FROM streets').get().c;

  log('');
  log('=== Migration Complete ===');
  log(`Streets: ${streetsDone}/${totalStreets} delivered`);
  log(`Houses: ${delivered}/${total} (${Math.round(delivered / total * 100)}%)`);
});

try {
  migrate();
} catch (err) {
  console.error('[migrate] ERROR:', err.message);
  process.exit(1);
} finally {
  db.close();
}
