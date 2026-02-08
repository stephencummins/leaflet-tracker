/**
 * One-shot migration script to update the running SQLite database
 * to match the newest CSV (January 26 Leaflets).
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
  if (!volCols.includes('notes')) {
    db.exec('ALTER TABLE volunteers ADD COLUMN notes TEXT');
    log('Added notes column to volunteers');
  }

  // ── 2. Register new volunteers ─────────────────────────────────
  const insertVol = db.prepare('INSERT OR IGNORE INTO volunteers (name) VALUES (?)');
  for (const name of ['Chris Hind', 'Martha', 'Poppy', 'Cavan']) {
    const r = insertVol.run(name);
    if (r.changes) log(`Registered volunteer: ${name}`);
  }

  // Set Chris Hind's notes
  db.prepare(`UPDATE volunteers SET notes = ? WHERE name = 'Chris Hind'`)
    .run('Also delivered Elm Road, Leigh Hall Road, Leighton Avenue & Oakleigh Park Drive in Blenheim Park area');
  log("Set Chris Hind's Blenheim Park footnote");

  // Helper to get volunteer ID
  const getVol = db.prepare('SELECT id FROM volunteers WHERE name = ?');
  // Helper to get street
  const getStreet = db.prepare('SELECT id, house_count, is_complete FROM streets WHERE name = ? AND zone_id = ?');

  // ── 3. WJZ reassignments: Leigh Road, London Road, Woodfield Gardens, Woodfield Park Drive → Robert Howes ──
  // These were previously delivered by Granville Stride, now credited to Robert Howes
  const robertId = getVol.get('Robert Howes').id;
  const granvilleId = getVol.get('Granville Stride').id;

  const reassignToRobert = [
    'Leigh Road',
    'London Road',
    'Woodfield Gardens',
    'Woodfield Park Drive',
  ];

  for (const streetName of reassignToRobert) {
    const street = getStreet.get(streetName, 'WJZ');
    if (street) {
      // Update completed_by
      db.prepare('UPDATE streets SET completed_by = ? WHERE id = ?').run(robertId, street.id);
      // Update delivery_log to credit Robert Howes
      db.prepare('UPDATE delivery_log SET volunteer_id = ? WHERE street_id = ? AND volunteer_id = ?')
        .run(robertId, street.id, granvilleId);
      log(`Reassigned ${streetName} (WJZ) → Robert Howes`);
    }
  }

  // ── 4. WJZ new assignments (delivered) ─────────────────────────
  const marthaId = getVol.get('Martha').id;
  const cavanId = getVol.get('Cavan').id;
  const poppyId = getVol.get('Poppy').id;

  const newAssignments = [
    { street: 'Leighcliff Road / Maple Avenue / Victor Drive', zone: 'WJZ', volId: marthaId, volName: 'Martha' },
    { street: 'Lord Roberts Avenue', zone: 'WJZ', volId: cavanId, volName: 'Cavan' },
    { street: 'Somerville Gardens / Carlton Drive / Nelson Drive', zone: 'WJZ', volId: poppyId, volName: 'Poppy' },
  ];

  const markComplete = db.prepare(
    "UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = ? WHERE id = ?"
  );
  const insertLog = db.prepare(
    'INSERT INTO delivery_log (street_id, volunteer_id, house_count) VALUES (?, ?, ?)'
  );

  for (const a of newAssignments) {
    const street = getStreet.get(a.street, a.zone);
    if (street) {
      if (street.is_complete) {
        // Reassign existing completion
        db.prepare('UPDATE streets SET completed_by = ? WHERE id = ?').run(a.volId, street.id);
        db.prepare('UPDATE delivery_log SET volunteer_id = ? WHERE street_id = ?').run(a.volId, street.id);
        log(`Reassigned ${a.street} → ${a.volName}`);
      } else {
        markComplete.run(a.volId, street.id);
        insertLog.run(street.id, a.volId, street.house_count);
        log(`Marked ${a.street} as delivered by ${a.volName}`);
      }
    }
  }

  // ── 5. WJZ newly delivered by Granville ────────────────────────
  const newGranville = [
    'Chalkwell Park Drive',
    'Cliffsea Grove',
    'Grand Drive (even only)',
    'Grand Parade',
    'Marguerite Drive',
    'Portchester Court',
  ];

  for (const streetName of newGranville) {
    const street = getStreet.get(streetName, 'WJZ');
    if (street && !street.is_complete) {
      markComplete.run(granvilleId, street.id);
      insertLog.run(street.id, granvilleId, street.house_count);
      log(`Marked ${streetName} (WJZ) as delivered by Granville Stride`);
    }
  }

  // ── 6. Un-deliver Woodfield Road / Glen Road ───────────────────
  const woodfield = getStreet.get('Woodfield Road / Glen Road', 'WJZ');
  if (woodfield && woodfield.is_complete) {
    db.prepare('UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL WHERE id = ?')
      .run(woodfield.id);
    db.prepare('DELETE FROM delivery_log WHERE street_id = ?').run(woodfield.id);
    log('Un-delivered Woodfield Road / Glen Road (WJZ)');
  }

  // ── 7. Remove WOZ deliveries (all 6 Robert Howes) ─────────────
  const wozStreets = db.prepare("SELECT id, name FROM streets WHERE zone_id = 'WOZ' AND is_complete = 1").all();
  for (const s of wozStreets) {
    db.prepare('UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL WHERE id = ?')
      .run(s.id);
    db.prepare('DELETE FROM delivery_log WHERE street_id = ?').run(s.id);
    log(`Un-delivered ${s.name} (WOZ)`);
  }

  // ── 8. Chris Hind's Blenheim Park extra houses ─────────────────
  const chrisId = getVol.get('Chris Hind').id;
  const blenheimStreets = [
    { name: 'Elm Road (Blenheim Park)', count: 140 },
    { name: 'Leigh Hall Road (Blenheim Park)', count: 120 },
    { name: 'Leighton Avenue (Blenheim Park)', count: 115 },
    { name: 'Oakleigh Park Drive (Blenheim Park)', count: 135 },
  ];

  // Check if we already have these entries (idempotent)
  const existingBlenheim = db.prepare(
    "SELECT COUNT(*) as c FROM delivery_log WHERE volunteer_id = ? AND street_id IS NULL"
  ).get(chrisId);

  // We need a street_id for delivery_log FK — create a virtual "Blenheim Park" street in a special way.
  // Actually, delivery_log requires street_id (NOT NULL). Let's create a placeholder street for Blenheim Park.
  let blenheimStreet = db.prepare("SELECT id FROM streets WHERE name = 'Blenheim Park (extra)' AND zone_id = 'WJZ'").get();
  if (!blenheimStreet) {
    const totalBlenheim = blenheimStreets.reduce((sum, s) => sum + s.count, 0); // 510
    db.prepare("INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Blenheim Park (extra)', ?, 1, datetime('now'), ?)")
      .run(totalBlenheim, chrisId);
    blenheimStreet = db.prepare("SELECT id FROM streets WHERE name = 'Blenheim Park (extra)' AND zone_id = 'WJZ'").get();
    insertLog.run(blenheimStreet.id, chrisId, totalBlenheim);
    log(`Added Blenheim Park (extra) street with ${totalBlenheim} houses for Chris Hind`);
  }

  // ── 9. Summary ─────────────────────────────────────────────────
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
