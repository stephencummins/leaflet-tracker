CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward TEXT NOT NULL UNIQUE,
  candidate_name TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO candidates (ward, candidate_name) VALUES
  ('Belfairs', 'Alan Crystall'),
  ('Blenheim Park', 'Andy Wilkins'),
  ('Chalkwell', 'Chris Hind'),
  ('Eastwood Park', 'Robert McMullan'),
  ('Kursaal', 'Billy Boulton'),
  ('Leigh', 'Carole Mulroney'),
  ('Milton', 'Robert Howes'),
  ('Prittlewell', 'David Barrett'),
  ('Shoeburyness', 'Michael Trace'),
  ('Southchurch', ''),
  ('St Laurence', 'Kev Malone'),
  ('St Luke''s', 'Linda Wells'),
  ('Thorpe', 'Katie Kurilecz'),
  ('Victoria', 'Phil Edey'),
  ('West Leigh', 'Stephen Cummins'),
  ('West Shoebury', 'John Batch'),
  ('Westborough', 'Suzanna Edey');
