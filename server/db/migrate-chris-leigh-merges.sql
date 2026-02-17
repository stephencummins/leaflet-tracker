-- Migration: Chris Hind's Leigh street corrections
-- Removes 2 zero-house streets, merges 9 split streets into single entries
-- Date: 2026-02-15

BEGIN TRANSACTION;

-- ============================================================
-- Remove zero-house streets
-- ============================================================

DELETE FROM assignments WHERE street_id IN (131, 130);
DELETE FROM delivery_log WHERE street_id IN (131, 130);
DELETE FROM streets WHERE id IN (131, 130);
-- 131 = Belton Bridge (WLZ, 0 houses)
-- 130 = Belton Gardens (WLZ, 0 houses)

-- ============================================================
-- Merge 1: Rectory Grove (3 → 1, keep WKZ id=171)
-- ============================================================

-- Move any assignments/logs from deleted streets to survivor
UPDATE assignments SET street_id = 171 WHERE street_id IN (181, 182) AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 171);
DELETE FROM assignments WHERE street_id IN (181, 182);
UPDATE delivery_log SET street_id = 171 WHERE street_id IN (181, 182);
DELETE FROM streets WHERE id IN (181, 182);
UPDATE streets SET name = 'Rectory Grove', house_count = 95 WHERE id = 171;

-- ============================================================
-- Merge 2: Glendale Gardens - Leigh portion (2 → 1, keep WNZ id=26)
-- ============================================================

UPDATE assignments SET street_id = 26 WHERE street_id = 179 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 26);
DELETE FROM assignments WHERE street_id = 179;
UPDATE delivery_log SET street_id = 26 WHERE street_id = 179;
DELETE FROM streets WHERE id = 179;
UPDATE streets SET name = 'Glendale Gardens (Elm Road to Grange Road/Marine Avenue)', house_count = 100 WHERE id = 26;

-- ============================================================
-- Merge 3: Leigh Park Road (2 → 1, keep WKZ id=22)
-- ============================================================

UPDATE assignments SET street_id = 22 WHERE street_id = 176 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 22);
DELETE FROM assignments WHERE street_id = 176;
UPDATE delivery_log SET street_id = 22 WHERE street_id = 176;
DELETE FROM streets WHERE id = 176;
UPDATE streets SET name = 'Leigh Park Road', house_count = 46 WHERE id = 22;

-- ============================================================
-- Merge 4: Chalkwell Park Drive (2 → 1, keep WJZ id=1)
-- ============================================================

UPDATE assignments SET street_id = 1 WHERE street_id = 112 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 1);
DELETE FROM assignments WHERE street_id = 112;
UPDATE delivery_log SET street_id = 1 WHERE street_id = 112;
DELETE FROM streets WHERE id = 112;
UPDATE streets SET name = 'Chalkwell Park Drive (including Porchester Court)', house_count = 145 WHERE id = 1;

-- ============================================================
-- Merge 5: Grand Parade (2 → 1, keep WJZ id=5)
-- ============================================================

UPDATE assignments SET street_id = 5 WHERE street_id = 166 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 5);
DELETE FROM assignments WHERE street_id = 166;
UPDATE delivery_log SET street_id = 5 WHERE street_id = 166;
DELETE FROM streets WHERE id = 166;
UPDATE streets SET name = 'Grand Parade (including 117-123)', house_count = 115 WHERE id = 5;

-- ============================================================
-- Merge 6: Pall Mall (3 → 1, keep WMZ id=109)
-- ============================================================

UPDATE assignments SET street_id = 109 WHERE street_id IN (170, 159) AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 109);
DELETE FROM assignments WHERE street_id IN (170, 159);
UPDATE delivery_log SET street_id = 109 WHERE street_id IN (170, 159);
DELETE FROM streets WHERE id IN (170, 159);
UPDATE streets SET name = 'Pall Mall', house_count = 167 WHERE id = 109;

-- ============================================================
-- Merge 7: Billet Lane (2 → 1, keep WLZ id=173)
-- ============================================================

UPDATE assignments SET street_id = 173 WHERE street_id = 161 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 173);
DELETE FROM assignments WHERE street_id = 161;
UPDATE delivery_log SET street_id = 173 WHERE street_id = 161;
DELETE FROM streets WHERE id = 161;
UPDATE streets SET name = 'Billet Lane', house_count = 8 WHERE id = 173;

-- ============================================================
-- Merge 8: The Broadway (2 → 1, keep WKZ id=118)
-- ============================================================

UPDATE assignments SET street_id = 118 WHERE street_id = 156 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 118);
DELETE FROM assignments WHERE street_id = 156;
UPDATE delivery_log SET street_id = 118 WHERE street_id = 156;
DELETE FROM streets WHERE id = 156;
UPDATE streets SET name = 'The Broadway', house_count = 104 WHERE id = 118;

-- ============================================================
-- Merge 9: Church Hill (2 → 1, keep WKZ id=163)
-- ============================================================

UPDATE assignments SET street_id = 163 WHERE street_id = 174 AND NOT EXISTS (SELECT 1 FROM assignments WHERE street_id = 163);
DELETE FROM assignments WHERE street_id = 174;
UPDATE delivery_log SET street_id = 163 WHERE street_id = 174;
DELETE FROM streets WHERE id = 174;
UPDATE streets SET name = 'Church Hill', house_count = 28 WHERE id = 163;

COMMIT;
