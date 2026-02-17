#!/usr/bin/env node
// Geocode West Leigh streets using Nominatim (free, 1 req/sec rate limit)
// Outputs SQL UPDATE statements to stdout

const ZONES = ['WOZ', 'WPZ', 'WQZ', 'WRZ', 'WSZ'];
const BOUNDS = { latMin: 51.53, latMax: 51.57, lngMin: 0.58, lngMax: 0.70 };

// Manual coordinates for streets Nominatim struggles with
const MANUAL = {
  'Cameron Close / Dundee Avenue / Dundee Close / Forfar Close': [51.5575, 0.6340],
  'Highlands Boulevard / Herschell Road': [51.5530, 0.6350],
  'Lime Avenue / Fairview Gardens / Foxwood Place / Underwood Square': [51.5560, 0.6280],
  'London Road (north side Stirling Avenue to Eastwood Road)': [51.5545, 0.6330],
  'London Road (south side Western Road to Salisbury Road)': [51.5470, 0.6350],
  'London Road (south side Salisbury Road to Hadleigh Road)': [51.5460, 0.6430],
  'London Road (south side Hadleigh Road to New Road)': [51.5445, 0.6500],
  'London Road (north side no. 1713 upwards)': [51.5565, 0.6230],
  'Marine Parade (Salisbury Road to Thames Drive)': [51.5395, 0.6370],
  'Marine Parade (Thames Drive to Hadleigh Road)': [51.5390, 0.6440],
  'Marine Parade (Hadleigh Road to Chalkwell Station)': [51.5385, 0.6510],
  'Glendale Gardens (Western Road to Hadleigh Road)': [51.5480, 0.6430],
  'Hadleigh Road (London Road to Glendale Gardens / Western Road)': [51.5455, 0.6390],
  'Hadleigh Road (Western Road to New Road)': [51.5450, 0.6480],
  'Salisbury Road (south side)': [51.5435, 0.6370],
  'Salisbury Road (north side)': [51.5440, 0.6370],
  'Western Road (south side)': [51.5450, 0.6340],
  'Grange Road (west side)': [51.5430, 0.6540],
  'Marine Avenue (west side)': [51.5405, 0.6540],
  'Herschell Road (south of Highlands Boulevard)': [51.5500, 0.6370],
  'Highlands Boulevard (no. 115 upwards)': [51.5555, 0.6250],
  'West Leigh Avenue / Lambeth Gardens / Lapwater Close / Hazel Road / Leigh Park Close': [51.5470, 0.6500],
  'Ronald Hill Grove (Grange Road to Marine Avenue)': [51.5415, 0.6530],
  'Agnes Avenue / Adalia Way': [51.5570, 0.6210],
  'Braemar Crescent / Aberdeen Gardens / Hamilton Close': [51.5555, 0.6260],
  'Buxton Avenue / Buxton Close / Cosgrove Avenue': [51.5565, 0.6180],
  'Doris Road / Ormonde Gardens': [51.5540, 0.6290],
  'Ewan Way / Ewan Close': [51.5555, 0.6200],
  'Henry Drive / Tennyson Close': [51.5550, 0.6220],
  'Vardon Drive / Marshall Close': [51.5570, 0.6190],
  'Woodlands Park Road / Warren Road / Sylvan Way': [51.5580, 0.6170],
  'Tattersall Gardens / Chapmans Walk / Chapmans Close': [51.5420, 0.6330],
  'Thames Drive / Thames Close': [51.5410, 0.6370],
  'Canvey Road / Ray Walk / Ray Close': [51.5430, 0.6420],
  'Crescent Road / Hamboro Gardens': [51.5440, 0.6410],
  'Medway Crescent / Darenth Road / Dynevor Gardens / Dale Road': [51.5445, 0.6310],
};

function getSearchName(name) {
  // Take first street from compound names
  if (name.includes('/')) {
    name = name.split('/')[0].trim();
  }
  // Remove parenthetical descriptions
  name = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  return name;
}

async function geocode(streetName) {
  if (MANUAL[streetName]) return MANUAL[streetName];

  const searchName = getSearchName(streetName);
  const query = `${searchName}, Leigh-on-Sea, Essex, UK`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'LeafletTracker/1.0 (volunteer campaign tracker)' },
  });
  const data = await res.json();

  if (data && data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (lat >= BOUNDS.latMin && lat <= BOUNDS.latMax && lng >= BOUNDS.lngMin && lng <= BOUNDS.lngMax) {
      return [lat, lng];
    }
    console.error(`-- OUT OF BOUNDS: ${streetName} -> ${lat}, ${lng}`);
  } else {
    console.error(`-- NOT FOUND: ${streetName}`);
  }
  return null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const Database = (await import('better-sqlite3')).default;
  const db = new Database(new URL('../tracker.db', import.meta.url).pathname, { readonly: true });

  const streets = db.prepare(
    `SELECT id, zone_id, name FROM streets WHERE zone_id IN (${ZONES.map(z => `'${z}'`).join(',')}) ORDER BY zone_id, name`
  ).all();

  console.log('-- Geocode West Leigh streets');
  console.log(`-- Generated: ${new Date().toISOString()}\n`);

  let found = 0, missed = 0;
  for (const street of streets) {
    const coords = await geocode(street.name);
    if (coords) {
      console.log(`UPDATE streets SET latitude = ${coords[0].toFixed(4)}, longitude = ${coords[1].toFixed(4)} WHERE id = ${street.id};  -- ${street.name}`);
      found++;
    } else {
      console.log(`-- FAILED: id=${street.id} ${street.name}`);
      missed++;
    }
    // Rate limit for Nominatim
    if (!MANUAL[street.name]) await sleep(1100);
  }

  console.log(`\n-- Done: ${found} geocoded, ${missed} failed`);
  db.close();
}

main();
