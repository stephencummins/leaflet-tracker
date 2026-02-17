-- Migration: Add walks feature
-- Date: 2026-02-17

CREATE TABLE IF NOT EXISTS walks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS walk_streets (
  walk_id INTEGER NOT NULL REFERENCES walks(id) ON DELETE CASCADE,
  street_id INTEGER NOT NULL REFERENCES streets(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (walk_id, street_id)
);
