-- Migration: Replace West Leigh streets with Chris Hind's exact spreadsheet text
-- Fixes names, house counts, zone assignments, and adds missing streets
-- Date: 2026-02-17

BEGIN TRANSACTION;

-- ============================================================
-- Step 1: Delete all current West Leigh streets
-- (No user-generated assignments/logs exist for these streets,
--  only the Leaflet Angel seeded completions)
-- ============================================================

DELETE FROM delivery_log WHERE street_id IN (SELECT id FROM streets WHERE zone_id IN ('WOZ','WPZ','WQZ','WRZ','WSZ'));
DELETE FROM assignments WHERE street_id IN (SELECT id FROM streets WHERE zone_id IN ('WOZ','WPZ','WQZ','WRZ','WSZ'));
DELETE FROM streets WHERE zone_id IN ('WOZ','WPZ','WQZ','WRZ','WSZ');

-- ============================================================
-- Step 2: Insert Chris's exact spreadsheet text
-- ============================================================

-- WRZ (12 streets)
-- Note: Southsea Avenue replaced by Vardon Drive (73-149 and 64-106)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Bailey Road (including Musset House)', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Barnard Road', 23);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Dundee Avenue (including Cameron Close, Dundee Close, Forfar Close)', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Eaton Road', 50);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Edinburgh Avenue', 53);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Gordon Road', 29);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Highlands Boulevard (18-96; 107-41) and Herschell Road (117-121; 142-132)', 80);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Lime Avenue (including Fairview Gardens, Foxwood Place, Underwood Square)', 86);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'London Road (North side only, from Stirling Avenue - Eastwood Road)', 122);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Montague Avenue', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Sydney Road', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Vardon Drive (73-149 and 64-106)', 61);

-- WSZ (15 streets)
-- Note: "Doris Road / Ormonde Gardens" replaced by "St. David's Drive..." entry
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Adalia Crescent', 68);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Agnes Avenue & Adalia Way', 47);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Braemar Crescent, Aberdeen Gardens (3-23, 4, 6, 28-42), Hamilton Close (1-3, 2-6)', 79);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Buxton Avenue, Buxton Square, Buxton Close, Cosgrove Avenue', 73);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Ewan Way (1-23, 2-16), Ewan Close (9-14)', 27);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Henry Drive, Tennyson Close', 49);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Highlands Boulevard (115-257; 266-102), Green Court', 136);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'London Road (North Side only, nos 1713-1913)', 66);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Olive Avenue (7-115, 108-8)', 90);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'St. David''s Drive (3-59, 4-32), St. David''s Terrace, Ormonde Gardens (1-9)', 46);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Stirling Avenue', 34);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Sutherland Boulevard', 34);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Vardon Drive (11-69, 6-58), Marshall Close', 71);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Walker Drive', 46);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Woodlands Park (1-33, 6-40), Warren Road (1-25, 2-16), Sylvan Way (5, 6, 8), Forest View Drive (Ashstock House, The Willows, Wood Lodge, Linkswood)', 58);

-- WQZ (10 streets)
-- Note: Leigh Heath Court added; Tattersall now separate from Chapmans (moved to WPZ);
--       Medway/Dynevor split and moved to WPZ
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Berkeley Gardens', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Cottismore Gardens', 60);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Leigh Heath Court', 43);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'London Road (South side, Tattersall Gardens - Crescent Road), excluding Leigh Heath Court', 72);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Marine Close', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Marine Parade (West Leigh Crescent Road - Tattersall Gardens)', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Quorn Gardens', 65);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Tattersall Gardens', 97);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Thames Drive, Thames Close', 85);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Western Road (Tattersall Gardens - Crescent Road)', 90);

-- WPZ (8 streets)
-- Note: Chapmans Walk/Close moved from WQZ; Dynevor/Dale and Medway/Darenth split from old combined entry;
--       Hadleigh Road (London Road to Glendale) moved to WOZ; Leigh Gardens added to Harley Street
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Canvey Road, Ray Walk, Ray Close', 102);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Chapmans Walk, Chapmans Close', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Crescent Road, Hamboro Gardens', 106);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Dynevor Gardens, Dale Road', 39);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Harley Street, Leigh Gardens', 77);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Marine Parade (Hadleigh Road - Crescent Road)', 95);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Medway Crescent, Darenth Road', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Park Road', 40);

-- WAZ/WOZ (15 streets, stored as zone_id 'WOZ')
-- Note: Major restructure — Hadleigh Road split; Salisbury Road combined; Westcliff Drive and Western Road added;
--       Westleigh Avenue replaces West Leigh Avenue / Lambeth Gardens...; Marine Parade removed (now outside)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Burnham Road', 79);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Glendale Gardens (Hadleigh Road - Marine Avenue/Grange Road)', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Grange Road (5-49, 54-92a)', 60);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Hadleigh Road (Glendale Gardens/Western Road - Marine Parade)', 77);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Hadleigh Road (London Road - Glendale Gardens/Western Road), Leigh Park Close', 110);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Herschell Road', 78);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'London Road (South side, Crescent Road - Leigh Cemetery), Hazel Close, Lapwater Close', 100);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Marine Avenue (West side - odd numbers only)', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Percy Road', 38);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Salisbury Road (including Senier House)', 126);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Theobalds Road', 36);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Vernon Road', 66);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Westcliff Drive', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Western Road (Crescent Road - Hadleigh Road)', 112);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Westleigh Avenue, plus 56 Ronald Hill Grove only', 76);

-- ============================================================
-- Step 3: Restore known completions (Leaflet Angel volunteer)
-- ============================================================

-- WRZ: Bailey Road, Eaton Road, Gordon Road were previously complete
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WRZ' AND name IN (
    'Bailey Road (including Musset House)',
    'Eaton Road',
    'Gordon Road'
  );

-- WSZ: Henry Drive, Olive Avenue, Walker Drive were previously complete
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WSZ' AND name IN (
    'Henry Drive, Tennyson Close',
    'Olive Avenue (7-115, 108-8)',
    'Walker Drive'
  );

-- WQZ: Berkeley Gardens, Marine Close, Marine Parade, Tattersall Gardens, Thames Drive, Western Road
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WQZ' AND name IN (
    'Berkeley Gardens',
    'Marine Close',
    'Marine Parade (West Leigh Crescent Road - Tattersall Gardens)',
    'Tattersall Gardens',
    'Thames Drive, Thames Close',
    'Western Road (Tattersall Gardens - Crescent Road)'
  );

-- WPZ: Canvey Road, Crescent Road, Harley Street, Marine Parade were previously complete
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WPZ' AND name IN (
    'Canvey Road, Ray Walk, Ray Close',
    'Crescent Road, Hamboro Gardens',
    'Harley Street, Leigh Gardens',
    'Marine Parade (Hadleigh Road - Crescent Road)'
  );

-- WOZ: Grange Road, Hadleigh Road (Western Road section), Herschell Road, Salisbury Road were previously complete
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WOZ' AND name IN (
    'Grange Road (5-49, 54-92a)',
    'Hadleigh Road (Glendale Gardens/Western Road - Marine Parade)',
    'Herschell Road',
    'Salisbury Road (including Senier House)'
  );

COMMIT;
