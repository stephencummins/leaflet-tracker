CREATE TABLE IF NOT EXISTS postal_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward TEXT NOT NULL UNIQUE,
  has_voter_list INTEGER NOT NULL DEFAULT 0,
  voter_count INTEGER NOT NULL DEFAULT 0,
  gm_letter_prepared INTEGER NOT NULL DEFAULT 0,
  gm_letter_printed INTEGER NOT NULL DEFAULT 0,
  gm_letter_delivered INTEGER NOT NULL DEFAULT 0,
  gm_letter_date TEXT NOT NULL DEFAULT '',
  reminder_prepared INTEGER NOT NULL DEFAULT 0,
  reminder_printed INTEGER NOT NULL DEFAULT 0,
  reminder_delivered INTEGER NOT NULL DEFAULT 0,
  reminder_date TEXT NOT NULL DEFAULT '',
  doorknock_done INTEGER NOT NULL DEFAULT 0,
  doorknock_date TEXT NOT NULL DEFAULT '',
  ballot_dispatch_date TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
);

-- Seed one row per ward
INSERT OR IGNORE INTO postal_votes (ward) VALUES
  ('Belfairs'), ('Blenheim Park'), ('Chalkwell'), ('Eastwood Park'),
  ('Kursaal'), ('Leigh'), ('Milton'), ('Prittlewell'),
  ('Shoeburyness'), ('Southchurch'), ('St Laurence'), ('St Luke''s'),
  ('Thorpe'), ('Victoria'), ('West Leigh'), ('West Shoebury'), ('Westborough');
