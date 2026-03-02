-- Election expenses tracker per ward
CREATE TABLE IF NOT EXISTS ward_expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward TEXT NOT NULL UNIQUE,
  elector_count INTEGER NOT NULL DEFAULT 0,
  base_amount REAL NOT NULL DEFAULT 960.00,
  per_elector_rate REAL NOT NULL DEFAULT 0.08,
  seats_up INTEGER NOT NULL DEFAULT 1,
  budgeted_spend REAL NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT ''
);

-- Individual expense line items
CREATE TABLE IF NOT EXISTS expense_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward_id INTEGER NOT NULL REFERENCES ward_expenses(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'other',
  date TEXT NOT NULL DEFAULT '',
  receipt_ref TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed one row per Southend ward
INSERT OR IGNORE INTO ward_expenses (ward) VALUES
  ('Belfairs'), ('Blenheim Park'), ('Chalkwell'), ('Eastwood Park'),
  ('Kursaal'), ('Leigh'), ('Milton'), ('Prittlewell'),
  ('Shoeburyness'), ('Southchurch'), ('St Laurence'), ('St Luke''s'),
  ('Thorpe'), ('Victoria'), ('West Leigh'), ('West Shoebury'), ('Westborough');
