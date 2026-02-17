-- Migration: Replace West Leigh streets with Chris Hind's canonical data
-- Merges WAZ into WOZ (displayed as "WAZ/WOZ"), replaces all street data
-- Preserves Leaflet Angel (id=40) completion status where streets match
-- Date: 2026-02-15

BEGIN TRANSACTION;

-- ============================================================
-- Step 1: Merge WAZ zone into WOZ
-- ============================================================

-- Delete all WAZ streets (and their logs)
DELETE FROM delivery_log WHERE street_id IN (SELECT id FROM streets WHERE zone_id = 'WAZ');
DELETE FROM assignments WHERE street_id IN (SELECT id FROM streets WHERE zone_id = 'WAZ');
DELETE FROM streets WHERE zone_id = 'WAZ';
DELETE FROM zones WHERE id = 'WAZ';

-- Rename WOZ to WAZ/WOZ
UPDATE zones SET name = 'Zone WAZ/WOZ' WHERE id = 'WOZ';

-- ============================================================
-- Step 2: Delete all existing West Leigh streets
-- ============================================================

DELETE FROM delivery_log WHERE street_id IN (SELECT id FROM streets WHERE zone_id IN ('WOZ', 'WPZ', 'WQZ', 'WRZ', 'WSZ'));
DELETE FROM assignments WHERE street_id IN (SELECT id FROM streets WHERE zone_id IN ('WOZ', 'WPZ', 'WQZ', 'WRZ', 'WSZ'));
DELETE FROM streets WHERE zone_id IN ('WOZ', 'WPZ', 'WQZ', 'WRZ', 'WSZ');

-- ============================================================
-- Step 3: Insert Chris's canonical streets
-- ============================================================

-- WRZ (12 streets, 689 houses)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Bailey Road', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Barnard Road', 23);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Cameron Close / Dundee Avenue / Dundee Close / Forfar Close', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Eaton Road', 50);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Edinburgh Avenue', 53);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Gordon Road', 29);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Highlands Boulevard / Herschell Road', 80);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Lime Avenue / Fairview Gardens / Foxwood Place / Underwood Square', 86);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'London Road (north side Stirling Avenue to Eastwood Road)', 122);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Montague Avenue', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Southsea Avenue', 61);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WRZ', 'Sydney Road', 40);

-- WSZ (15 streets, 924 houses)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Adalia Crescent', 68);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Agnes Avenue / Adalia Way', 47);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Braemar Crescent / Aberdeen Gardens / Hamilton Close', 79);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Buxton Avenue / Buxton Close / Cosgrove Avenue', 73);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Doris Road / Ormonde Gardens', 46);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Ewan Way / Ewan Close', 27);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Henry Drive / Tennyson Close', 49);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Highlands Boulevard (no. 115 upwards)', 136);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'London Road (north side no. 1713 upwards)', 66);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Olive Avenue', 90);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Stirling Avenue', 34);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Sutherland Boulevard', 34);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Vardon Drive / Marshall Close', 71);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Walker Drive', 46);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WSZ', 'Woodlands Park Road / Warren Road / Sylvan Way', 58);

-- WQZ (10 streets, 662 houses)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Berkeley Gardens', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Cottismore Gardens', 60);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'London Road (south side Western Road to Salisbury Road)', 72);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Marine Close', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Marine Parade (Salisbury Road to Thames Drive)', 55);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Quorn Gardens', 65);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Tattersall Gardens / Chapmans Walk / Chapmans Close', 152);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Thames Drive / Thames Close', 85);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Western Road (south side)', 78);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WQZ', 'Medway Crescent / Darenth Road / Dynevor Gardens / Dale Road', 0);

-- WPZ (8 streets, 569 houses)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Canvey Road / Ray Walk / Ray Close', 102);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Crescent Road / Hamboro Gardens', 106);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Hadleigh Road (London Road to Glendale Gardens / Western Road)', 110);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Harley Street', 80);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'London Road (south side Salisbury Road to Hadleigh Road)', 58);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Marine Parade (Thames Drive to Hadleigh Road)', 80);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Park Road', 6);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WPZ', 'Salisbury Road (south side)', 27);

-- WAZ/WOZ (15 streets, 1088 houses) — stored as zone_id 'WOZ'
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Burnham Road', 79);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Glendale Gardens (Western Road to Hadleigh Road)', 50);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Grange Road (west side)', 24);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Hadleigh Road (Western Road to New Road)', 105);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Herschell Road (south of Highlands Boulevard)', 100);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Leigh Park Close', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'London Road (south side Hadleigh Road to New Road)', 120);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Marine Avenue (west side)', 30);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Marine Parade (Hadleigh Road to Chalkwell Station)', 80);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Percy Road', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Ronald Hill Grove (Grange Road to Marine Avenue)', 33);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Salisbury Road (north side)', 60);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Theobalds Road', 50);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'Vernon Road', 40);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WOZ', 'West Leigh Avenue / Lambeth Gardens / Lapwater Close / Hazel Road / Leigh Park Close', 137);

-- ============================================================
-- Step 4: Re-mark Leaflet Angel completions where streets match
-- ============================================================

-- WRZ: Bailey Road, Eaton Road, Gordon Road
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WRZ' AND name IN ('Bailey Road', 'Eaton Road', 'Gordon Road');

-- WSZ: Henry Drive / Tennyson Close, Olive Avenue, Walker Drive
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WSZ' AND name IN ('Henry Drive / Tennyson Close', 'Olive Avenue', 'Walker Drive');

-- WQZ: Berkeley Gardens, Marine Close, Marine Parade, Tattersall Gardens (now includes Chapmans), Thames Drive / Thames Close, Western Road (now south side)
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WQZ' AND name IN (
    'Berkeley Gardens',
    'Marine Close',
    'Marine Parade (Salisbury Road to Thames Drive)',
    'Tattersall Gardens / Chapmans Walk / Chapmans Close',
    'Thames Drive / Thames Close',
    'Western Road (south side)'
  );

-- WPZ: Canvey Road, Crescent Road / Hamboro, Harley Street, Marine Parade
-- (Chapmans Walk moved to WQZ with Tattersall, Dynevor moved to WQZ with Medway)
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WPZ' AND name IN (
    'Canvey Road / Ray Walk / Ray Close',
    'Crescent Road / Hamboro Gardens',
    'Harley Street',
    'Marine Parade (Thames Drive to Hadleigh Road)'
  );

-- WOZ (was WAZ+WOZ): Grange Road, Herschell Road, Marine Parade, Salisbury Road, Western Road → now split differently
-- Old completed: Grange Road, Hadleigh Road, Herschell Road, Marine Parade, Salisbury Road, Western Road (from both WAZ and WOZ)
UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = 40
  WHERE zone_id = 'WOZ' AND name IN (
    'Grange Road (west side)',
    'Hadleigh Road (Western Road to New Road)',
    'Herschell Road (south of Highlands Boulevard)',
    'Marine Parade (Hadleigh Road to Chalkwell Station)',
    'Salisbury Road (north side)'
  );

COMMIT;
