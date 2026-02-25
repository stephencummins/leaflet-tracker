const fs = require("fs");
const path = require("path");

function runMigrations(db) {
  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      run_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationDir = __dirname;
  const files = fs.readdirSync(migrationDir)
    .filter(f => f.startsWith("migrate-") && f.endsWith(".sql"))
    .sort();

  for (const filename of files) {
    const already = db.prepare("SELECT id FROM _migrations WHERE filename = ?").get(filename);
    if (already) continue;

    const sql = fs.readFileSync(path.join(migrationDir, filename), "utf8");
    db.exec(sql);
    db.prepare("INSERT INTO _migrations (filename) VALUES (?)").run(filename);
    console.log(`[migrate] Applied ${filename}`);
  }
}

module.exports = { runMigrations };
