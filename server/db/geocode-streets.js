/**
 * One-shot script to geocode all streets using Nominatim (OpenStreetMap).
 * Rate-limited to 1 request per second per Nominatim usage policy.
 *
 * Run with: node server/db/geocode-streets.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'tracker.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Manual fallback coordinates for streets that may fail geocoding
// (compound names, courts, etc.) — centered on Leigh-on-Sea area
const MANUAL_COORDS = {
  // WJZ
  'Chalkwell Park Drive': [51.5425, 0.6465],
  'Cliffsea Grove': [51.5410, 0.6480],
  'Dundonald Drive': [51.5418, 0.6510],
  'Grand Drive (even only)': [51.5395, 0.6520],
  'Grand Parade': [51.5380, 0.6490],
  'Highcliff Drive': [51.5405, 0.6530],
  'Hillside Crescent': [51.5412, 0.6545],
  'Leigh Road': [51.5432, 0.6500],
  'Leighcliff Road / Maple Avenue / Victor Drive': [51.5398, 0.6555],
  'London Road': [51.5445, 0.6485],
  'Lord Roberts Avenue': [51.5420, 0.6560],
  'Marguerite Drive': [51.5408, 0.6575],
  'Portchester Court': [51.5390, 0.6540],
  'Somerville Gardens / Carlton Drive / Nelson Drive': [51.5415, 0.6590],
  'Undercliff Gardens': [51.5385, 0.6510],
  'Woodfield Gardens': [51.5438, 0.6530],
  'Woodfield Park Drive': [51.5442, 0.6545],
  'Woodfield Road / Glen Road': [51.5435, 0.6560],
  'Blenheim Park (extra)': [51.5460, 0.6440],

  // WLZ
  'Church Hill / Leigh Hill Close / The Gardens': [51.5415, 0.6410],
  'Hadleigh Road': [51.5440, 0.6395],
  'High Street (up to 60-62 and 77)': [51.5425, 0.6385],
  'Leigh Park Road': [51.5448, 0.6410],
  'New Road / Billet Lane / Laurel Close': [51.5455, 0.6375],
  'Uttons Avenue': [51.5450, 0.6360],

  // WNZ
  'Fairleigh Drive': [51.5460, 0.6480],
  'Glendale Gardens': [51.5470, 0.6500],
  'Grange Road': [51.5465, 0.6460],
  'Leighville Grove': [51.5458, 0.6510],
  'London Road (1152-1188)': [51.5475, 0.6470],
  'Marine Avenue': [51.5450, 0.6475],
  'Ronald Hill Grove': [51.5462, 0.6520],

  // WOZ
  'Marine Parade': [51.5370, 0.6400],
  'Percy Road': [51.5385, 0.6385],
  'Salisbury Road': [51.5395, 0.6370],
  'Westcliff Drive': [51.5378, 0.6365],

  // WPZ
  'Burnham Road': [51.5478, 0.6390],
  'Canvey Road / Ray Walk / Ray Close': [51.5485, 0.6355],
  'Crescent Road / Hamboro Gardens': [51.5480, 0.6420],
  'Hadleigh Road (London Rd to Glendale/Western)': [51.5475, 0.6405],
  'Harley Street': [51.5490, 0.6375],
  'Hazel Close': [51.5488, 0.6340],
  'Herschell Road': [51.5472, 0.6435],
  'Lambeth Gardens': [51.5482, 0.6450],
  'Lapwater Close': [51.5492, 0.6365],
  'Leigh Park Close': [51.5468, 0.6425],
  'Marine Parade': [51.5365, 0.6380],
  'Park Road': [51.5470, 0.6380],
  'Salisbury Road': [51.5460, 0.6370],
  'Theobalds Road': [51.5478, 0.6345],
  'Vernon Road': [51.5485, 0.6410],
  'Western Road': [51.5475, 0.6440],

  // WQZ
  'Berkeley Gardens': [51.5495, 0.6310],
  'Chapmans Walk / Chapmans Close': [51.5502, 0.6290],
  'Cottismore Gardens': [51.5498, 0.6330],
  'Dynevor Gardens / Dale Road': [51.5505, 0.6305],
  'Leigh Heath Court': [51.5500, 0.6350],
  'London Road (south side)': [51.5495, 0.6275],
  'Marine Close': [51.5488, 0.6295],
  'Medway Crescent / Darenth Road': [51.5508, 0.6320],
  'Quorn Gardens': [51.5510, 0.6340],
  'Tattersall Gardens': [51.5512, 0.6355],
  'Thames Drive / Thames Close': [51.5515, 0.6280],

  // WRZ
  'Bailey Road': [51.5520, 0.6250],
  'Barnard Road': [51.5525, 0.6235],
  'Cameron Close / Dundee Avenue / Dundee Close / Forfar Close': [51.5530, 0.6265],
  'Eaton Road': [51.5518, 0.6280],
  'Edinburgh Avenue': [51.5528, 0.6245],
  'Gordon Road': [51.5522, 0.6260],
  'Highlands Blvd / Herschell Road': [51.5535, 0.6290],
  'Lime Avenue / Fairview Gardens / Foxwood Place / Underwood Square': [51.5540, 0.6275],
  'London Road (north side Stirling-Eastwood)': [51.5532, 0.6230],
  'Montague Avenue': [51.5538, 0.6250],
  'Southsea Avenue': [51.5515, 0.6270],
  'Sydney Road': [51.5525, 0.6295],
  'Vardon Drive': [51.5542, 0.6265],

  // WSZ
  'Adalia Crescent': [51.5548, 0.6220],
  'Agnes Avenue / Adalia Way': [51.5552, 0.6205],
  'Braemar Crescent / Aberdeen Gardens / Hamilton Close': [51.5555, 0.6240],
  'Buxton Avenue / Buxton Close / Cosgrove Avenue': [51.5558, 0.6225],
  'Doris / Ormonde Gardens': [51.5550, 0.6255],
  'Ewan Way / Ewan Close': [51.5562, 0.6210],
  'Henry Drive / Tennyson Close': [51.5545, 0.6245],
  'Highlands Blvd (115+)': [51.5560, 0.6270],
  'London Road (north side 1713+)': [51.5565, 0.6195],
  'Olive Avenue': [51.5555, 0.6260],
  'Stirling Avenue': [51.5548, 0.6235],
  'Sutherland Blvd': [51.5552, 0.6250],
  'Vardon Drive / Marshall Close': [51.5558, 0.6280],
  'Walker Drive': [51.5545, 0.6265],
  'Woodlands Park / Warren Road / Sylvan Way': [51.5562, 0.6290],
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract the first street name from a compound name for geocoding
function getSearchName(name) {
  // Remove parenthetical descriptions
  let clean = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  // Take first street if compound (split on / )
  if (clean.includes(' / ')) {
    clean = clean.split(' / ')[0].trim();
  }
  return clean;
}

async function geocodeStreet(streetName) {
  const searchName = getSearchName(streetName);
  const query = `${searchName}, Leigh-on-Sea, Essex, UK`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LeafletTracker/1.0 (volunteer campaign tracker)' },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (err) {
    console.error(`  Nominatim error for "${streetName}": ${err.message}`);
  }
  return null;
}

async function main() {
  // Ensure columns exist
  const cols = db.prepare("PRAGMA table_info(streets)").all().map(c => c.name);
  if (!cols.includes('latitude')) {
    db.exec('ALTER TABLE streets ADD COLUMN latitude REAL');
  }
  if (!cols.includes('longitude')) {
    db.exec('ALTER TABLE streets ADD COLUMN longitude REAL');
  }

  const streets = db.prepare('SELECT id, name, zone_id, latitude, longitude FROM streets').all();
  const update = db.prepare('UPDATE streets SET latitude = ?, longitude = ? WHERE id = ?');

  let geocoded = 0;
  let manual = 0;
  let skipped = 0;

  for (const street of streets) {
    // Skip if already geocoded
    if (street.latitude && street.longitude) {
      skipped++;
      continue;
    }

    // Try Nominatim first
    console.log(`Geocoding: ${street.name} (${street.zone_id})...`);
    let coords = await geocodeStreet(street.name);

    if (coords) {
      // Validate coords are roughly in Leigh-on-Sea area (51.53-51.57, 0.58-0.68)
      if (coords[0] >= 51.53 && coords[0] <= 51.57 && coords[1] >= 0.58 && coords[1] <= 0.68) {
        update.run(coords[0], coords[1], street.id);
        console.log(`  -> ${coords[0]}, ${coords[1]} (Nominatim)`);
        geocoded++;
        await sleep(1100); // Rate limit
        continue;
      } else {
        console.log(`  -> Nominatim result outside area (${coords[0]}, ${coords[1]}), using fallback`);
      }
    }

    // Fallback to manual coordinates
    const fallback = MANUAL_COORDS[street.name];
    if (fallback) {
      update.run(fallback[0], fallback[1], street.id);
      console.log(`  -> ${fallback[0]}, ${fallback[1]} (manual fallback)`);
      manual++;
    } else {
      // Last resort: center of Leigh-on-Sea with small random offset
      const lat = 51.543 + (Math.random() - 0.5) * 0.01;
      const lng = 0.654 + (Math.random() - 0.5) * 0.01;
      update.run(lat, lng, street.id);
      console.log(`  -> ${lat.toFixed(4)}, ${lng.toFixed(4)} (random fallback - NEEDS MANUAL FIX)`);
      manual++;
    }

    await sleep(1100); // Rate limit even on fallbacks to be safe
  }

  console.log('');
  console.log('=== Geocoding Complete ===');
  console.log(`Nominatim: ${geocoded} | Manual fallback: ${manual} | Already done: ${skipped}`);
  console.log(`Total: ${streets.length} streets`);

  db.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  db.close();
  process.exit(1);
});
