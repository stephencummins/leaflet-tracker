-- Geocode West Leigh streets (v2) — UPDATE by name after exact-names migration
-- Generated: 2026-02-17

-- WRZ (12 streets)
UPDATE streets SET latitude = 51.5495, longitude = 0.6357 WHERE zone_id = 'WRZ' AND name = 'Bailey Road (including Musset House)';
UPDATE streets SET latitude = 51.5487, longitude = 0.6380 WHERE zone_id = 'WRZ' AND name = 'Barnard Road';
UPDATE streets SET latitude = 51.5575, longitude = 0.6340 WHERE zone_id = 'WRZ' AND name = 'Dundee Avenue (including Cameron Close, Dundee Close, Forfar Close)';
UPDATE streets SET latitude = 51.5489, longitude = 0.6413 WHERE zone_id = 'WRZ' AND name = 'Eaton Road';
UPDATE streets SET latitude = 51.5517, longitude = 0.6368 WHERE zone_id = 'WRZ' AND name = 'Edinburgh Avenue';
UPDATE streets SET latitude = 51.5488, longitude = 0.6355 WHERE zone_id = 'WRZ' AND name = 'Gordon Road';
UPDATE streets SET latitude = 51.5530, longitude = 0.6350 WHERE zone_id = 'WRZ' AND name = 'Highlands Boulevard (18-96; 107-41) and Herschell Road (117-121; 142-132)';
UPDATE streets SET latitude = 51.5560, longitude = 0.6280 WHERE zone_id = 'WRZ' AND name = 'Lime Avenue (including Fairview Gardens, Foxwood Place, Underwood Square)';
UPDATE streets SET latitude = 51.5545, longitude = 0.6330 WHERE zone_id = 'WRZ' AND name = 'London Road (North side only, from Stirling Avenue - Eastwood Road)';
UPDATE streets SET latitude = 51.5517, longitude = 0.6356 WHERE zone_id = 'WRZ' AND name = 'Montague Avenue';
UPDATE streets SET latitude = 51.5486, longitude = 0.6367 WHERE zone_id = 'WRZ' AND name = 'Sydney Road';
UPDATE streets SET latitude = 51.5510, longitude = 0.6325 WHERE zone_id = 'WRZ' AND name = 'Vardon Drive (73-149 and 64-106)';

-- WSZ (15 streets)
UPDATE streets SET latitude = 51.5527, longitude = 0.6343 WHERE zone_id = 'WSZ' AND name = 'Adalia Crescent';
UPDATE streets SET latitude = 51.5570, longitude = 0.6210 WHERE zone_id = 'WSZ' AND name = 'Agnes Avenue & Adalia Way';
UPDATE streets SET latitude = 51.5555, longitude = 0.6260 WHERE zone_id = 'WSZ' AND name = 'Braemar Crescent, Aberdeen Gardens (3-23, 4, 6, 28-42), Hamilton Close (1-3, 2-6)';
UPDATE streets SET latitude = 51.5565, longitude = 0.6180 WHERE zone_id = 'WSZ' AND name = 'Buxton Avenue, Buxton Square, Buxton Close, Cosgrove Avenue';
UPDATE streets SET latitude = 51.5555, longitude = 0.6200 WHERE zone_id = 'WSZ' AND name = 'Ewan Way (1-23, 2-16), Ewan Close (9-14)';
UPDATE streets SET latitude = 51.5550, longitude = 0.6220 WHERE zone_id = 'WSZ' AND name = 'Henry Drive, Tennyson Close';
UPDATE streets SET latitude = 51.5555, longitude = 0.6250 WHERE zone_id = 'WSZ' AND name = 'Highlands Boulevard (115-257; 266-102), Green Court';
UPDATE streets SET latitude = 51.5565, longitude = 0.6230 WHERE zone_id = 'WSZ' AND name = 'London Road (North Side only, nos 1713-1913)';
UPDATE streets SET latitude = 51.5496, longitude = 0.6285 WHERE zone_id = 'WSZ' AND name = 'Olive Avenue (7-115, 108-8)';
UPDATE streets SET latitude = 51.5540, longitude = 0.6290 WHERE zone_id = 'WSZ' AND name = 'St. David''s Drive (3-59, 4-32), St. David''s Terrace, Ormonde Gardens (1-9)';
UPDATE streets SET latitude = 51.5495, longitude = 0.6336 WHERE zone_id = 'WSZ' AND name = 'Stirling Avenue';
UPDATE streets SET latitude = 51.5487, longitude = 0.6308 WHERE zone_id = 'WSZ' AND name = 'Sutherland Boulevard';
UPDATE streets SET latitude = 51.5487, longitude = 0.6308 WHERE zone_id = 'WSZ' AND name = 'Vardon Drive (11-69, 6-58), Marshall Close';
UPDATE streets SET latitude = 51.5507, longitude = 0.6290 WHERE zone_id = 'WSZ' AND name = 'Walker Drive';
UPDATE streets SET latitude = 51.5580, longitude = 0.6170 WHERE zone_id = 'WSZ' AND name = 'Woodlands Park (1-33, 6-40), Warren Road (1-25, 2-16), Sylvan Way (5, 6, 8), Forest View Drive (Ashstock House, The Willows, Wood Lodge, Linkswood)';

-- WQZ (10 streets)
UPDATE streets SET latitude = 51.5471, longitude = 0.6282 WHERE zone_id = 'WQZ' AND name = 'Berkeley Gardens';
UPDATE streets SET latitude = 51.5462, longitude = 0.6316 WHERE zone_id = 'WQZ' AND name = 'Cottismore Gardens';
UPDATE streets SET latitude = 51.5470, longitude = 0.6350 WHERE zone_id = 'WQZ' AND name = 'Leigh Heath Court';
UPDATE streets SET latitude = 51.5470, longitude = 0.6355 WHERE zone_id = 'WQZ' AND name = 'London Road (South side, Tattersall Gardens - Crescent Road), excluding Leigh Heath Court';
UPDATE streets SET latitude = 51.5447, longitude = 0.6278 WHERE zone_id = 'WQZ' AND name = 'Marine Close';
UPDATE streets SET latitude = 51.5395, longitude = 0.6370 WHERE zone_id = 'WQZ' AND name = 'Marine Parade (West Leigh Crescent Road - Tattersall Gardens)';
UPDATE streets SET latitude = 51.5472, longitude = 0.6269 WHERE zone_id = 'WQZ' AND name = 'Quorn Gardens';
UPDATE streets SET latitude = 51.5420, longitude = 0.6330 WHERE zone_id = 'WQZ' AND name = 'Tattersall Gardens';
UPDATE streets SET latitude = 51.5410, longitude = 0.6370 WHERE zone_id = 'WQZ' AND name = 'Thames Drive, Thames Close';
UPDATE streets SET latitude = 51.5450, longitude = 0.6340 WHERE zone_id = 'WQZ' AND name = 'Western Road (Tattersall Gardens - Crescent Road)';

-- WPZ (8 streets)
UPDATE streets SET latitude = 51.5430, longitude = 0.6420 WHERE zone_id = 'WPZ' AND name = 'Canvey Road, Ray Walk, Ray Close';
UPDATE streets SET latitude = 51.5445, longitude = 0.6390 WHERE zone_id = 'WPZ' AND name = 'Chapmans Walk, Chapmans Close';
UPDATE streets SET latitude = 51.5440, longitude = 0.6410 WHERE zone_id = 'WPZ' AND name = 'Crescent Road, Hamboro Gardens';
UPDATE streets SET latitude = 51.5445, longitude = 0.6310 WHERE zone_id = 'WPZ' AND name = 'Dynevor Gardens, Dale Road';
UPDATE streets SET latitude = 51.5455, longitude = 0.6390 WHERE zone_id = 'WPZ' AND name = 'Harley Street, Leigh Gardens';
UPDATE streets SET latitude = 51.5390, longitude = 0.6440 WHERE zone_id = 'WPZ' AND name = 'Marine Parade (Hadleigh Road - Crescent Road)';
UPDATE streets SET latitude = 51.5445, longitude = 0.6310 WHERE zone_id = 'WPZ' AND name = 'Medway Crescent, Darenth Road';
UPDATE streets SET latitude = 51.5468, longitude = 0.6359 WHERE zone_id = 'WPZ' AND name = 'Park Road';

-- WAZ/WOZ (15 streets, zone_id = 'WOZ')
UPDATE streets SET latitude = 51.5456, longitude = 0.6440 WHERE zone_id = 'WOZ' AND name = 'Burnham Road';
UPDATE streets SET latitude = 51.5480, longitude = 0.6430 WHERE zone_id = 'WOZ' AND name = 'Glendale Gardens (Hadleigh Road - Marine Avenue/Grange Road)';
UPDATE streets SET latitude = 51.5430, longitude = 0.6540 WHERE zone_id = 'WOZ' AND name = 'Grange Road (5-49, 54-92a)';
UPDATE streets SET latitude = 51.5450, longitude = 0.6480 WHERE zone_id = 'WOZ' AND name = 'Hadleigh Road (Glendale Gardens/Western Road - Marine Parade)';
UPDATE streets SET latitude = 51.5469, longitude = 0.6420 WHERE zone_id = 'WOZ' AND name = 'Hadleigh Road (London Road - Glendale Gardens/Western Road), Leigh Park Close';
UPDATE streets SET latitude = 51.5500, longitude = 0.6370 WHERE zone_id = 'WOZ' AND name = 'Herschell Road';
UPDATE streets SET latitude = 51.5445, longitude = 0.6500 WHERE zone_id = 'WOZ' AND name = 'London Road (South side, Crescent Road - Leigh Cemetery), Hazel Close, Lapwater Close';
UPDATE streets SET latitude = 51.5405, longitude = 0.6540 WHERE zone_id = 'WOZ' AND name = 'Marine Avenue (West side - odd numbers only)';
UPDATE streets SET latitude = 51.5474, longitude = 0.6463 WHERE zone_id = 'WOZ' AND name = 'Percy Road';
UPDATE streets SET latitude = 51.5440, longitude = 0.6370 WHERE zone_id = 'WOZ' AND name = 'Salisbury Road (including Senier House)';
UPDATE streets SET latitude = 51.5454, longitude = 0.6463 WHERE zone_id = 'WOZ' AND name = 'Theobalds Road';
UPDATE streets SET latitude = 51.5451, longitude = 0.6414 WHERE zone_id = 'WOZ' AND name = 'Vernon Road';
UPDATE streets SET latitude = 51.5395, longitude = 0.6510 WHERE zone_id = 'WOZ' AND name = 'Westcliff Drive';
UPDATE streets SET latitude = 51.5450, longitude = 0.6420 WHERE zone_id = 'WOZ' AND name = 'Western Road (Crescent Road - Hadleigh Road)';
UPDATE streets SET latitude = 51.5470, longitude = 0.6500 WHERE zone_id = 'WOZ' AND name = 'Westleigh Avenue, plus 56 Ronald Hill Grove only';
