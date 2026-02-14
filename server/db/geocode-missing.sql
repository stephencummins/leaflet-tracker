-- Geocode all streets missing coordinates
-- Based on Leigh-on-Sea / West Leigh area geography

BEGIN TRANSACTION;

-- ============================================================
-- WAZ (West Leigh, around Hadleigh Road / Marine Parade area)
-- ============================================================
UPDATE streets SET latitude = 51.5458, longitude = 0.6440 WHERE id = 144;  -- Burnham Road
UPDATE streets SET latitude = 51.5448, longitude = 0.6499 WHERE id = 148;  -- Glendale Gardens
UPDATE streets SET latitude = 51.5441, longitude = 0.6480 WHERE id = 147;  -- Grange Road
UPDATE streets SET latitude = 51.5442, longitude = 0.6494 WHERE id = 146;  -- Hadleigh Road
UPDATE streets SET latitude = 51.5456, longitude = 0.6401 WHERE id = 141;  -- Herschell Road
UPDATE streets SET latitude = 51.5434, longitude = 0.6392 WHERE id = 149;  -- Marine Parade
UPDATE streets SET latitude = 51.5464, longitude = 0.6452 WHERE id = 145;  -- Salisbury Road
UPDATE streets SET latitude = 51.5442, longitude = 0.6430 WHERE id = 143;  -- Theobalds Road
UPDATE streets SET latitude = 51.5452, longitude = 0.6414 WHERE id = 142;  -- Vernon Road
UPDATE streets SET latitude = 51.5456, longitude = 0.6349 WHERE id = 150;  -- Western Road

-- ============================================================
-- WJZ (Leigh, Woodfield / Chalkwell area)
-- ============================================================
UPDATE streets SET latitude = 51.5438, longitude = 0.6640 WHERE id = 156;  -- Broadway (east side Leigh Road to Grand Drive)
UPDATE streets SET latitude = 51.5410, longitude = 0.6618 WHERE id = 157;  -- Grand Drive (east side)
UPDATE streets SET latitude = 51.5402, longitude = 0.6558 WHERE id = 151;  -- Maple Avenue
UPDATE streets SET latitude = 51.5448, longitude = 0.6635 WHERE id = 159;  -- Pall Mall (Marguerite Drive to Chalkwell Park Drive)
UPDATE streets SET latitude = 51.5392, longitude = 0.6652 WHERE id = 160;  -- Undercliff Gardens
UPDATE streets SET latitude = 51.5400, longitude = 0.6562 WHERE id = 152;  -- Victor Drive

-- ============================================================
-- WKZ (Leigh, Old Town / Broadway / Cliff area)
-- Central area around Broadway: lat ~51.541-51.544, lng ~0.640-0.655
-- ============================================================
UPDATE streets SET latitude = 51.5420, longitude = 0.6528 WHERE id = 117;  -- Alexandra Road
UPDATE streets SET latitude = 51.5405, longitude = 0.6535 WHERE id = 123;  -- Ashleigh Drive
UPDATE streets SET latitude = 51.5415, longitude = 0.6545 WHERE id = 121;  -- Avenue Road
UPDATE streets SET latitude = 51.5380, longitude = 0.6440 WHERE id = 169;  -- Belton Corner, Marine Parade
UPDATE streets SET latitude = 51.5430, longitude = 0.6560 WHERE id = 118;  -- Broadway (south side...)
UPDATE streets SET latitude = 51.5432, longitude = 0.6500 WHERE id = 113;  -- Broadway West
UPDATE streets SET latitude = 51.5422, longitude = 0.6505 WHERE id = 162;  -- Canonsleigh Crescent
UPDATE streets SET latitude = 51.5405, longitude = 0.6478 WHERE id = 163;  -- Church Hill (Old School House & The Terrace)
UPDATE streets SET latitude = 51.5388, longitude = 0.6460 WHERE id = 164;  -- Cliff Parade (including Sea Reach)
UPDATE streets SET latitude = 51.5408, longitude = 0.6468 WHERE id = 161;  -- Creek Cottage at top of Billet Lane
UPDATE streets SET latitude = 51.5412, longitude = 0.6510 WHERE id = 115;  -- East Street
UPDATE streets SET latitude = 51.5435, longitude = 0.6530 WHERE id = 165;  -- Elm Road (east side North Street to Pall Mall)
UPDATE streets SET latitude = 51.5415, longitude = 0.6590 WHERE id = 127;  -- Grand Drive (west side)
UPDATE streets SET latitude = 51.5395, longitude = 0.6580 WHERE id = 166;  -- Grand Parade (Grand Drive to Cliff Parade)
UPDATE streets SET latitude = 51.5428, longitude = 0.6485 WHERE id = 167;  -- Hadleigh Road (Leigh Park Road to Rectory Grove)
UPDATE streets SET latitude = 51.5440, longitude = 0.6520 WHERE id = 122;  -- Leigh Hall Road (Pall Mall to Broadway)
UPDATE streets SET latitude = 51.5398, longitude = 0.6490 WHERE id = 129;  -- Leigh Hill (Broadway to Cliff Parade)
UPDATE streets SET latitude = 51.5442, longitude = 0.6545 WHERE id = 168;  -- Leigham Court Drive (Broadway/Leigh Road to Pall Mall)
UPDATE streets SET latitude = 51.5438, longitude = 0.6555 WHERE id = 125;  -- Leighton Avenue (Broadway to Pall Mall)
UPDATE streets SET latitude = 51.5418, longitude = 0.6515 WHERE id = 116;  -- North Street
UPDATE streets SET latitude = 51.5442, longitude = 0.6568 WHERE id = 124;  -- Oakleigh Park Drive (Broadway to Pall Mall)
UPDATE streets SET latitude = 51.5445, longitude = 0.6538 WHERE id = 170;  -- Pall Mall (south side Leigham Court Drive to Elm Road)
UPDATE streets SET latitude = 51.5408, longitude = 0.6520 WHERE id = 128;  -- Queens Road
UPDATE streets SET latitude = 51.5435, longitude = 0.6508 WHERE id = 171;  -- Rectory Grove (south side)
UPDATE streets SET latitude = 51.5395, longitude = 0.6545 WHERE id = 126;  -- Redcliff Drive
UPDATE streets SET latitude = 51.5390, longitude = 0.6505 WHERE id = 119;  -- Seaview Road
UPDATE streets SET latitude = 51.5410, longitude = 0.6525 WHERE id = 120;  -- Victoria Road
UPDATE streets SET latitude = 51.5405, longitude = 0.6500 WHERE id = 114;  -- West Street

-- ============================================================
-- WLZ (Leigh, Old Town / Leigh Hill area)
-- ============================================================
UPDATE streets SET latitude = 51.5395, longitude = 0.6445 WHERE id = 131;  -- Belton Bridge
UPDATE streets SET latitude = 51.5398, longitude = 0.6450 WHERE id = 130;  -- Belton Gardens
UPDATE streets SET latitude = 51.5402, longitude = 0.6470 WHERE id = 173;  -- Billet Lane (cottages at the bottom)
UPDATE streets SET latitude = 51.5400, longitude = 0.6475 WHERE id = 174;  -- Church Hill (all cottages below...)
UPDATE streets SET latitude = 51.5410, longitude = 0.6495 WHERE id = 175;  -- Hillside Road
UPDATE streets SET latitude = 51.5408, longitude = 0.6500 WHERE id = 172;  -- Laurel Close
UPDATE streets SET latitude = 51.5398, longitude = 0.6485 WHERE id = 132;  -- Leigh Hill (Cliff Parade to New Road...)
UPDATE streets SET latitude = 51.5415, longitude = 0.6495 WHERE id = 176;  -- Leigh Park Road (Leigh Hill to 13/38)
UPDATE streets SET latitude = 51.5408, longitude = 0.6480 WHERE id = 177;  -- The Gardens

-- ============================================================
-- WMZ (Leigh, north of Pall Mall to London Road)
-- Runs between roughly lng 0.650-0.660, lat 51.544-51.548
-- ============================================================
UPDATE streets SET latitude = 51.5468, longitude = 0.6610 WHERE id = 112;  -- Chalkwell Park Drive (west side)
UPDATE streets SET latitude = 51.5460, longitude = 0.6575 WHERE id = 103;  -- Cranleigh Drive
UPDATE streets SET latitude = 51.5458, longitude = 0.6595 WHERE id = 106;  -- Dawlish Drive
UPDATE streets SET latitude = 51.5465, longitude = 0.6530 WHERE id = 102;  -- Elm Road (Pall Mall to London Road)
UPDATE streets SET latitude = 51.5462, longitude = 0.6555 WHERE id = 179;  -- Glendale Gardens (Elm Road to Lymington Avenue)
UPDATE streets SET latitude = 51.5470, longitude = 0.6520 WHERE id = 107;  -- Leigh Hall Road (Broadway to London Road)
UPDATE streets SET latitude = 51.5472, longitude = 0.6545 WHERE id = 111;  -- Leigham Court Drive (Pall Mall to London Road)
UPDATE streets SET latitude = 51.5468, longitude = 0.6555 WHERE id = 110;  -- Leighton Avenue (Pall Mall to London Road)
UPDATE streets SET latitude = 51.5478, longitude = 0.6570 WHERE id = 180;  -- London Road (south side Oakleigh Park Drive to Lymington Avenue)
UPDATE streets SET latitude = 51.5472, longitude = 0.6568 WHERE id = 108;  -- Oakleigh Park Drive (Pall Mall to London Road)
UPDATE streets SET latitude = 51.5452, longitude = 0.6540 WHERE id = 109;  -- Pall Mall (north side Elm Road to Oakleigh Park Drive)
UPDATE streets SET latitude = 51.5455, longitude = 0.6575 WHERE id = 178;  -- Queens Avenue
UPDATE streets SET latitude = 51.5465, longitude = 0.6548 WHERE id = 181;  -- Rectory Grove (north side Elm Road to Lymington Avenue)
UPDATE streets SET latitude = 51.5475, longitude = 0.6505 WHERE id = 101;  -- Station Road
UPDATE streets SET latitude = 51.5458, longitude = 0.6588 WHERE id = 105;  -- Torquay Drive
UPDATE streets SET latitude = 51.5462, longitude = 0.6600 WHERE id = 104;  -- Victoria Drive

-- ============================================================
-- WNZ (Leigh, Lymington Avenue / Fairleigh area)
-- ============================================================
UPDATE streets SET latitude = 51.5475, longitude = 0.6555 WHERE id = 99;   -- Lymington Avenue
UPDATE streets SET latitude = 51.5460, longitude = 0.6505 WHERE id = 182;  -- Rectory Grove (north side Grange Road to Lymington Avenue)
UPDATE streets SET latitude = 51.5480, longitude = 0.6520 WHERE id = 100;  -- Southsea Avenue

-- ============================================================
-- WOZ (West Leigh)
-- ============================================================
UPDATE streets SET latitude = 51.5470, longitude = 0.6460 WHERE id = 137;  -- West Leigh Avenue

-- ============================================================
-- WPZ (West Leigh)
-- ============================================================
UPDATE streets SET latitude = 51.5445, longitude = 0.6380 WHERE id = 139;  -- Belton Way West
UPDATE streets SET latitude = 51.5450, longitude = 0.6395 WHERE id = 140;  -- Castle Drive
UPDATE streets SET latitude = 51.5455, longitude = 0.6410 WHERE id = 138;  -- Leigh Gardens

-- ============================================================
-- WSZ (West Leigh, north-west area)
-- ============================================================
UPDATE streets SET latitude = 51.5545, longitude = 0.6285 WHERE id = 133;  -- Forest View Drive
UPDATE streets SET latitude = 51.5540, longitude = 0.6270 WHERE id = 136;  -- Green Court
UPDATE streets SET latitude = 51.5550, longitude = 0.6295 WHERE id = 134;  -- St Davids Drive
UPDATE streets SET latitude = 51.5548, longitude = 0.6290 WHERE id = 135;  -- St Davids Terrace

COMMIT;
