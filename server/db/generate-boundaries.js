/**
 * One-shot script to generate zone and ward boundary GeoJSON.
 *
 * - Fetches ward boundaries (Leigh & West Leigh) from ONS ArcGIS API
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

// Ward codes from ONS
const WARD_CODES = {
  leigh: 'E05002217',
  west_leigh: 'E05002227',
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

async function fetchWardBoundary(wardCode) {
  const url = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_May_2024_Boundaries_UK_BGC/FeatureServer/0/query?where=WD24CD%3D%27${wardCode}%27&outFields=*&f=geojson`;
  console.log(`Fetching ward ${wardCode}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ward ${wardCode}: ${res.status}`);
  const data = await res.json();
  if (!data.features || data.features.length === 0) {
    throw new Error(`No features found for ward ${wardCode}`);
  }
  return data.features[0];
}

async function main() {
  const db = new Database(DB_PATH, { readonly: true });

  // 1. Fetch ward boundaries
  console.log('=== Fetching ward boundaries ===');
  const leighFeature = await fetchWardBoundary(WARD_CODES.leigh);
  const westLeighFeature = await fetchWardBoundary(WARD_CODES.west_leigh);

  const wards = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Leigh', code: WARD_CODES.leigh },
        geometry: leighFeature.geometry,
      },
      {
        type: 'Feature',
        properties: { name: 'West Leigh', code: WARD_CODES.west_leigh },
        geometry: westLeighFeature.geometry,
      },
    ],
  };
  const countVertices = (geom) => {
    if (geom.type === 'Polygon') return geom.coordinates[0].length;
    if (geom.type === 'MultiPolygon') return geom.coordinates.reduce((s, p) => s + p[0].length, 0);
    return 0;
  };
  console.log(`  Leigh: ${countVertices(leighFeature.geometry)} vertices (${leighFeature.geometry.type})`);
  console.log(`  West Leigh: ${countVertices(westLeighFeature.geometry)} vertices (${westLeighFeature.geometry.type})`);

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
    // Buffer outward by ~100m (0.001° ≈ 111m at this latitude)
    const buffered = bufferPolygon(hull, 0.001);
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
