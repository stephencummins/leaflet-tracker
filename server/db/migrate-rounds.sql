-- Rounds feature: track multiple delivery rounds

-- 1. Create rounds table
CREATE TABLE IF NOT EXISTS rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 2. Add round_id to delivery_log
ALTER TABLE delivery_log ADD COLUMN round_id INTEGER REFERENCES rounds(id);

-- 3. Create Round 1 (inactive) from existing data
INSERT INTO rounds (name, started_at, ended_at, is_active)
VALUES (
  'Round 1',
  (SELECT COALESCE(MIN(delivered_at), CURRENT_TIMESTAMP) FROM delivery_log),
  CURRENT_TIMESTAMP,
  0
);

-- 4. Backfill all existing delivery_log entries to Round 1
UPDATE delivery_log SET round_id = (SELECT id FROM rounds WHERE name = 'Round 1');

-- 5. Create Round 2 (active)
INSERT INTO rounds (name, started_at, is_active) VALUES ('Round 2', CURRENT_TIMESTAMP, 1);

-- 6. Reset all streets for the new round
UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL;

-- 7. Clear assignments
DELETE FROM assignments;
