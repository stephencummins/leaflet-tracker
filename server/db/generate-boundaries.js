/**
 * One-shot script to generate zone and ward boundary GeoJSON.
 *
 * - Fetches all 17 Southend-on-Sea ward boundaries from ONS ArcGIS API
 * - Generates zone polygons from street coordinates using convex hull
 * - Writes server/data/boundaries.json
 *
 * Run with: node server/db/generate-boundaries.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'tracker.db');
const OUT_PATH = path.join(__dirname, '..', 'data', 'boundaries.json');

// All 17 Southend-on-Sea ward codes from ONS (WD24CD)
const WARD_CODES = [
  'E05002212', // Belfairs
  'E05002213', // Blenheim Park
  'E05002214', // Chalkwell
  'E05002215', // Eastwood Park
  'E05002216', // Kursaal
  'E05002217', // Leigh
  'E05002218', // Milton
  'E05002219', // Prittlewell
  'E05002220', // St Laurence
  'E05002221', // St. Luke's
  'E05002222', // Shoeburyness
  'E05002223', // Southchurch
  'E05002224', // Thorpe
  'E05002225', // Victoria
  'E05002226', // Westborough
  'E05002227', // West Leigh
  'E05002228', // West Shoebury
];

// Normalize ONS ward names to match app conventions
const NAME_NORMALIZE = {
  "St. Luke's": "St Luke's",
};

// Zone-to-ward mapping (from seed data comments)
const ZONE_WARD = {
  WJZ: 'Leigh',
  WLZ: 'Leigh',
  WNZ: 'Leigh',
  WOZ: 'West Leigh',
  WPZ: 'West Leigh',
  WQZ: 'West Leigh',
  WRZ: 'West Leigh',
  WSZ: 'West Leigh',
};

// --- Convex Hull (Graham scan) ---

function cross(O, A, B) {
  return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
}

function convexHull(points) {
  if (points.length < 3) return points.slice();

  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  // Remove last point of each half because it's repeated
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

// Buffer a convex polygon outward by `dist` degrees
function bufferPolygon(hull, dist) {
  // Find centroid
  let cx = 0, cy = 0;
  for (const [x, y] of hull) { cx += x; cy += y; }
  cx /= hull.length;
  cy /= hull.length;

  return hull.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return [x + (dx / len) * dist, y + (dy / len) * dist];
  });
}

async function fetchAllWards() {
  const codeList = WARD_CODES.map(c => `'${c}'`).join(',');
  const where = encodeURIComponent(`WD24CD IN (${codeList})`);
  const url = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_May_2024_Boundaries_UK_BGC/FeatureServer/0/query?where=${where}&outFields=WD24CD,WD24NM&f=geojson&resultRecordCount=50`;
  console.log(`Fetching ${WARD_CODES.length} Southend wards...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch wards: ${res.status}`);
  const data = await res.json();
  if (!data.features || data.features.length === 0) {
    throw new Error('No ward features returned');
  }
  console.log(`  Got ${data.features.length} ward boundaries`);
  return data.features;
}

async function main() {
  const db = new Database(DB_PATH, { readonly: true });

  // 1. Fetch all Southend ward boundaries
  console.log('=== Fetching ward boundaries ===');
  const rawFeatures = await fetchAllWards();

  const countVertices = (geom) => {
    if (geom.type === 'Polygon') return geom.coordinates[0].length;
    if (geom.type === 'MultiPolygon') return geom.coordinates.reduce((s, p) => s + p[0].length, 0);
    return 0;
  };

  const wards = {
    type: 'FeatureCollection',
    features: rawFeatures.map(f => {
      const onsName = f.properties.WD24NM;
      const name = NAME_NORMALIZE[onsName] || onsName;
      console.log(`  ${name} (${f.properties.WD24CD}): ${countVertices(f.geometry)} vertices`);
      return {
        type: 'Feature',
        properties: { name, code: f.properties.WD24CD },
        geometry: f.geometry,
      };
    }),
  };

  // 2. Generate zone boundaries from street coordinates
  console.log('\n=== Generating zone boundaries ===');
  const zones = db.prepare(`
    SELECT z.id, z.name, z.color, s.latitude, s.longitude
    FROM zones z
    JOIN streets s ON s.zone_id = z.id
    WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL
    ORDER BY z.sort_order, s.name
  `).all();

  // Group by zone
  const zoneGroups = {};
  for (const row of zones) {
    if (!zoneGroups[row.id]) {
      zoneGroups[row.id] = { name: row.name, color: row.color, points: [] };
    }
    // GeoJSON uses [lng, lat] order
    zoneGroups[row.id].points.push([row.longitude, row.latitude]);
  }

  const zoneFeatures = [];
  for (const [zoneId, data] of Object.entries(zoneGroups)) {
    const hull = convexHull(data.points);
    // Buffer outward by ~45m (0.0004° ≈ 44m at this latitude)
    const buffered = bufferPolygon(hull, 0.0004);
    // Close the ring for GeoJSON
    const ring = [...buffered, buffered[0]];

    zoneFeatures.push({
      type: 'Feature',
      properties: {
        id: zoneId,
        name: data.name,
        color: data.color,
        ward: ZONE_WARD[zoneId] || 'Unknown',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
    });
    console.log(`  ${zoneId}: ${data.points.length} streets -> ${hull.length} hull vertices`);
  }

  const zonesGeoJSON = {
    type: 'FeatureCollection',
    features: zoneFeatures,
  };

  // 3. Write output
  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const output = { wards, zones: zonesGeoJSON };
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${path.relative(process.cwd(), OUT_PATH)}`);
  console.log(`  ${wards.features.length} ward boundaries`);
  console.log(`  ${zonesGeoJSON.features.length} zone boundaries`);

  db.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
