CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS streets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  name TEXT NOT NULL,
  house_count INTEGER NOT NULL,
  is_complete INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  completed_by INTEGER REFERENCES volunteers(id)
);

CREATE TABLE IF NOT EXISTS volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  street_id INTEGER NOT NULL UNIQUE REFERENCES streets(id),
  volunteer_id INTEGER NOT NULL REFERENCES volunteers(id),
  assigned_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS delivery_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  street_id INTEGER NOT NULL REFERENCES streets(id),
  volunteer_id INTEGER NOT NULL REFERENCES volunteers(id),
  house_count INTEGER NOT NULL,
  delivered_at TEXT NOT NULL DEFAULT (datetime('now'))
);
