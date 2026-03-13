CREATE TABLE IF NOT EXISTS proposer_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposer_key TEXT NOT NULL UNIQUE,
  asked INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
