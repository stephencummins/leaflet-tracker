CREATE TABLE IF NOT EXISTS canvass_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  assignee TEXT,
  week INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS canvass_roads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL REFERENCES canvass_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started',
  canvassed_by INTEGER REFERENCES volunteers(id),
  canvassed_at TEXT
);

CREATE TABLE IF NOT EXISTS canvass_tallies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  road_id INTEGER NOT NULL REFERENCES canvass_roads(id) ON DELETE CASCADE,
  volunteer_id INTEGER NOT NULL REFERENCES volunteers(id),
  support INTEGER NOT NULL DEFAULT 0,
  against INTEGER NOT NULL DEFAULT 0,
  undecided INTEGER NOT NULL DEFAULT 0,
  not_home INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_canvass_tallies_road ON canvass_tallies(road_id);

CREATE TABLE IF NOT EXISTS canvass_casework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  road_id INTEGER NOT NULL REFERENCES canvass_roads(id) ON DELETE CASCADE,
  volunteer_id INTEGER NOT NULL REFERENCES volunteers(id),
  resident_name TEXT,
  address TEXT,
  contact TEXT,
  issue TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
