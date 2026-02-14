-- Migration: Update Leigh ward streets to match Granville's canonical list
-- Volunteer IDs: Granville=1, Martha=15, Cavan=16, Andy Wilkins=18, Carole Mulroney=24, Leaflet Angel=40

BEGIN TRANSACTION;

-- ============================================================
-- WJZ: Update existing streets
-- ============================================================

UPDATE streets SET name = 'Chalkwell Park Drive (east side plus Porchester Court)', house_count = 94 WHERE id = 1;
UPDATE streets SET house_count = 86 WHERE id = 2;  -- Cliffsea Grove
-- Dundonald Drive (id=3) stays 81
UPDATE streets SET house_count = 110 WHERE id = 5;  -- Grand Parade
UPDATE streets SET name = 'High Cliff Drive' WHERE id = 6;  -- 67 stays
UPDATE streets SET name = 'Hillside Crescent (Woodfield Road to Woodfield Road)', house_count = 38 WHERE id = 7;
UPDATE streets SET name = 'Leigh Road (Woodfield Park Drive/Road to Broadway)' WHERE id = 8;  -- 124 stays
UPDATE streets SET house_count = 102 WHERE id = 11;  -- Lord Roberts Avenue
UPDATE streets SET house_count = 101 WHERE id = 12;  -- Marguerite Drive
-- Woodfield Gardens (id=16) stays 32
UPDATE streets SET name = 'Woodfield Park Drive (west side)' WHERE id = 17;  -- 42 stays

-- WJZ: Split "Leighcliff Road / Maple Avenue / Victor Drive" (id=9, Martha)
UPDATE streets SET name = 'Leighcliff Road', house_count = 68 WHERE id = 9;
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Maple Avenue', 25, 1, datetime('now'), 15);
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Victor Drive', 26, 1, datetime('now'), 15);

-- WJZ: Split "Somerville Gardens / Carlton Drive / Nelson Drive" (id=14, Granville)
UPDATE streets SET name = 'Somerville Gardens', house_count = 38 WHERE id = 14;
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Carlton Drive', 27, 1, datetime('now'), 1);
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Nelson Drive', 34, 1, datetime('now'), 1);

-- WJZ: Split "Woodfield Road / Glen Road" (id=18, Granville)
UPDATE streets SET name = 'Woodfield Road (west side)', house_count = 56 WHERE id = 18;
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Glen Road', 23, 1, datetime('now'), 1);

-- WJZ: New streets (not delivered)
INSERT INTO streets (zone_id, name, house_count) VALUES ('WJZ', 'Broadway (east side Leigh Road to Grand Drive)', 16);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WJZ', 'Grand Drive (east side)', 36);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WJZ', 'London Road (south side Woodfield Park Drive to Chalkwell Park Drive)', 23);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WJZ', 'Pall Mall (Marguerite Drive to Chalkwell Park Drive)', 6);

-- Undercliff Gardens missing from production DB - was delivered by Robert Howes (id=10)
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WJZ', 'Undercliff Gardens', 70, 1, datetime('now'), 10);

-- ============================================================
-- WKZ: Update existing streets
-- ============================================================

UPDATE streets SET house_count = 23 WHERE id = 117;  -- Alexandra Road
UPDATE streets SET house_count = 11 WHERE id = 123;  -- Ashleigh Drive
UPDATE streets SET house_count = 23 WHERE id = 121;  -- Avenue Road
UPDATE streets SET house_count = 128 WHERE id = 113;  -- Broadway West
UPDATE streets SET house_count = 29 WHERE id = 115;  -- East Street
UPDATE streets SET name = 'Grand Drive (west side)', house_count = 48 WHERE id = 127;
UPDATE streets SET name = 'Leigh Hall Road (Pall Mall to Broadway)', house_count = 60 WHERE id = 122;
UPDATE streets SET name = 'Leigh Hill (Broadway to Cliff Parade)', house_count = 18 WHERE id = 129;
UPDATE streets SET name = 'Leigh Park Road (Hadleigh Road to number 25/46)', house_count = 25 WHERE id = 22;
UPDATE streets SET name = 'Leighton Avenue (Broadway to Pall Mall)', house_count = 43 WHERE id = 125;
UPDATE streets SET house_count = 29 WHERE id = 116;  -- North Street
UPDATE streets SET name = 'Oakleigh Park Drive (Broadway to Pall Mall)', house_count = 58 WHERE id = 124;
UPDATE streets SET house_count = 51 WHERE id = 128;  -- Queens Road
UPDATE streets SET house_count = 17 WHERE id = 126;  -- Redcliff Drive
UPDATE streets SET name = 'Seaview Road', house_count = 35 WHERE id = 119;
UPDATE streets SET name = 'Broadway (south side Broadway West to Grand Drive & north side Broadway West to Pall Mall)', house_count = 88 WHERE id = 118;
UPDATE streets SET house_count = 35 WHERE id = 120;  -- Victoria Road
UPDATE streets SET house_count = 25 WHERE id = 114;  -- West Street

-- WKZ: New streets
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Creek Cottage at top of Billet Lane', 1);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Canonsleigh Crescent', 26);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Church Hill (Old School House & The Terrace)', 15);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Cliff Parade (including Sea Reach)', 48);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Elm Road (east side North Street to Pall Mall)', 45);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Grand Parade (Grand Drive to Cliff Parade)', 5);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Hadleigh Road (Leigh Park Road to Rectory Grove)', 6);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Leigham Court Drive (Broadway/Leigh Road to Pall Mall)', 10);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Belton Corner, Marine Parade', 2);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Pall Mall (south side Leigham Court Drive to Elm Road)', 65);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WKZ', 'Rectory Grove (south side)', 49);

-- ============================================================
-- WLZ: Update existing streets
-- ============================================================

UPDATE streets SET name = 'Hadleigh Road (Leigh Park Road to New Road)', house_count = 23 WHERE id = 20;
UPDATE streets SET name = 'High Street', house_count = 21 WHERE id = 21;
UPDATE streets SET name = 'Leigh Hill (Cliff Parade to New Road including Leigh Hill Close & Bell Sands)', house_count = 65 WHERE id = 132;
UPDATE streets SET house_count = 25 WHERE id = 24;  -- Uttons Avenue

-- WLZ: Split "New Road / Laurel Close" (id=23, Andy Wilkins)
UPDATE streets SET name = 'New Road', house_count = 35 WHERE id = 23;
INSERT INTO streets (zone_id, name, house_count, is_complete, completed_at, completed_by) VALUES ('WLZ', 'Laurel Close', 17, 1, datetime('now'), 18);

-- WLZ: New streets
INSERT INTO streets (zone_id, name, house_count) VALUES ('WLZ', 'Billet Lane (cottages at the bottom)', 7);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WLZ', 'Church Hill (all cottages below Old School House & The Terrace)', 13);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WLZ', 'Hillside Road', 6);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WLZ', 'Leigh Park Road (Leigh Hill to 13/38)', 21);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WLZ', 'The Gardens', 13);
-- Keep Belton Bridge (id=131) and Belton Gardens (id=130) - Leaflet Angel deliveries not on Granville's list

-- ============================================================
-- WMZ: Update existing streets
-- ============================================================

UPDATE streets SET name = 'Chalkwell Park Drive (west side)', house_count = 51 WHERE id = 112;
UPDATE streets SET house_count = 92 WHERE id = 103;  -- Cranleigh Drive
UPDATE streets SET name = 'Elm Road (Pall Mall to London Road)', house_count = 130 WHERE id = 102;
UPDATE streets SET name = 'Leigh Hall Road (Broadway to London Road)', house_count = 117 WHERE id = 107;
UPDATE streets SET name = 'Leigham Court Drive (Pall Mall to London Road)', house_count = 103 WHERE id = 111;
UPDATE streets SET name = 'Leighton Avenue (Pall Mall to London Road)', house_count = 117 WHERE id = 110;
UPDATE streets SET name = 'Oakleigh Park Drive (Pall Mall to London Road)', house_count = 130 WHERE id = 108;
UPDATE streets SET name = 'Pall Mall (north side Elm Road to Oakleigh Park Drive)', house_count = 96 WHERE id = 109;
UPDATE streets SET house_count = 67 WHERE id = 101;  -- Station Road
UPDATE streets SET house_count = 60 WHERE id = 105;  -- Torquay Drive
UPDATE streets SET house_count = 46 WHERE id = 104;  -- Victoria Drive

-- WMZ: Split "Dawlish Drive / Queens Avenue" (id=106, not delivered)
UPDATE streets SET name = 'Dawlish Drive', house_count = 86 WHERE id = 106;
INSERT INTO streets (zone_id, name, house_count) VALUES ('WMZ', 'Queens Avenue', 13);

-- WMZ: New streets
INSERT INTO streets (zone_id, name, house_count) VALUES ('WMZ', 'Glendale Gardens (Elm Road to Lymington Avenue)', 14);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WMZ', 'London Road (south side Oakleigh Park Drive to Lymington Avenue)', 32);
INSERT INTO streets (zone_id, name, house_count) VALUES ('WMZ', 'Rectory Grove (north side Elm Road to Lymington Avenue)', 16);

-- ============================================================
-- WNZ: Update existing streets
-- ============================================================

UPDATE streets SET house_count = 84 WHERE id = 25;  -- Fairleigh Drive
UPDATE streets SET name = 'Glendale Gardens (Lymington Avenue to Grange Road/Marine Avenue)', house_count = 86 WHERE id = 26;
UPDATE streets SET name = 'Grange Road (east side)', house_count = 24 WHERE id = 27;
UPDATE streets SET house_count = 66 WHERE id = 28;  -- Leighville Grove
UPDATE streets SET name = 'London Road (south side Lymington Avenue to West Leigh Schools)' WHERE id = 29;  -- 36 stays
UPDATE streets SET house_count = 153 WHERE id = 99;  -- Lymington Avenue
UPDATE streets SET name = 'Marine Avenue (east side)', house_count = 30 WHERE id = 30;
UPDATE streets SET name = 'Ronald Hill Grove (Marine Avenue to Southsea Avenue)', house_count = 33 WHERE id = 31;
UPDATE streets SET house_count = 138 WHERE id = 100;  -- Southsea Avenue

-- WNZ: New street
INSERT INTO streets (zone_id, name, house_count) VALUES ('WNZ', 'Rectory Grove (north side Grange Road to Lymington Avenue)', 30);

COMMIT;
