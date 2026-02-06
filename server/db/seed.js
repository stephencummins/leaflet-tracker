const ZONES = [
  { id: 'WJZ', name: 'Zone WJZ', color: '#E63946', sort_order: 1 },
  { id: 'WKZ', name: 'Zone WKZ', color: '#457B9D', sort_order: 2 },
  { id: 'WLZ', name: 'Zone WLZ', color: '#E9C46A', sort_order: 3 },
  { id: 'WMZ', name: 'Zone WMZ', color: '#2A9D8F', sort_order: 4 },
  { id: 'WNZ', name: 'Zone WNZ', color: '#7B2D8E', sort_order: 5 },
];

const STREETS = [
  // WJZ - 24 streets, 1325 houses
  { zone_id: 'WJZ', name: 'Broadway (east side Leigh Road to Grand Drive)', house_count: 16 },
  { zone_id: 'WJZ', name: 'Carlton Drive', house_count: 27 },
  { zone_id: 'WJZ', name: 'Chalkwell Park Drive (east side plus Porchester Court)', house_count: 94 },
  { zone_id: 'WJZ', name: 'Cliffsea Grove', house_count: 86 },
  { zone_id: 'WJZ', name: 'Dundonald Drive', house_count: 81 },
  { zone_id: 'WJZ', name: 'Glen Road', house_count: 23 },
  { zone_id: 'WJZ', name: 'Grand Drive (east side)', house_count: 36 },
  { zone_id: 'WJZ', name: 'Grand Parade', house_count: 110 },
  { zone_id: 'WJZ', name: 'High Cliff Drive', house_count: 67 },
  { zone_id: 'WJZ', name: 'Hillside Crescent (Woodfield Road to Woodfield Road)', house_count: 38 },
  { zone_id: 'WJZ', name: 'Leighcliff Road', house_count: 68 },
  { zone_id: 'WJZ', name: 'Leigh Road (Woodfield Park Drive/Road to Broadway)', house_count: 124 },
  { zone_id: 'WJZ', name: 'London Road (south side Woodfield Park Drive to Chalkwell Park Drive)', house_count: 23 },
  { zone_id: 'WJZ', name: 'Lord Roberts Avenue', house_count: 102 },
  { zone_id: 'WJZ', name: 'Maple Avenue', house_count: 25 },
  { zone_id: 'WJZ', name: 'Marguerite Drive', house_count: 101 },
  { zone_id: 'WJZ', name: 'Nelson Drive', house_count: 34 },
  { zone_id: 'WJZ', name: 'Pall Mall (Marguerite Drive to Chalkwell Park Drive)', house_count: 6 },
  { zone_id: 'WJZ', name: 'Somerville Gardens', house_count: 38 },
  { zone_id: 'WJZ', name: 'Undercliff Gardens', house_count: 70 },
  { zone_id: 'WJZ', name: 'Victor Drive', house_count: 26 },
  { zone_id: 'WJZ', name: 'Woodfield Gardens', house_count: 32 },
  { zone_id: 'WJZ', name: 'Woodfield Park Drive (west side)', house_count: 42 },
  { zone_id: 'WJZ', name: 'Woodfield Road (west side)', house_count: 56 },

  // WKZ - 29 streets, 1018 houses
  { zone_id: 'WKZ', name: 'Alexandra Road', house_count: 23 },
  { zone_id: 'WKZ', name: 'Ashleigh Drive', house_count: 11 },
  { zone_id: 'WKZ', name: 'Avenue Road', house_count: 23 },
  { zone_id: 'WKZ', name: 'Creek Cottage at top of Billet Lane', house_count: 1 },
  { zone_id: 'WKZ', name: 'Broadway (south side Broadway West to Grand Drive & north side Broadway West to Pall Mall)', house_count: 88 },
  { zone_id: 'WKZ', name: 'Broadway West', house_count: 128 },
  { zone_id: 'WKZ', name: 'Canonsleigh Crescent', house_count: 26 },
  { zone_id: 'WKZ', name: 'Church Hill (Old School House & The Terrace)', house_count: 15 },
  { zone_id: 'WKZ', name: 'Cliff Parade (including Sea Reach)', house_count: 48 },
  { zone_id: 'WKZ', name: 'East Street', house_count: 29 },
  { zone_id: 'WKZ', name: 'Elm Road (east side North Street to Pall Mall)', house_count: 45 },
  { zone_id: 'WKZ', name: 'Grand Drive (west side)', house_count: 48 },
  { zone_id: 'WKZ', name: 'Grand Parade (Grand Drive to Cliff Parade)', house_count: 5 },
  { zone_id: 'WKZ', name: 'Hadleigh Road (Leigh Park Road to Rectory Grove)', house_count: 6 },
  { zone_id: 'WKZ', name: 'Leigh Hall Road (Pall Mall to Broadway)', house_count: 60 },
  { zone_id: 'WKZ', name: 'Leigh Hill (Broadway to Cliff Parade)', house_count: 18 },
  { zone_id: 'WKZ', name: 'Leigh Park Road (Hadleigh Road to number 25/46)', house_count: 25 },
  { zone_id: 'WKZ', name: 'Leigham Court Drive (Broadway/Leigh Road to Pall Mall)', house_count: 10 },
  { zone_id: 'WKZ', name: 'Leighton Avenue (Broadway to Pall Mall)', house_count: 43 },
  { zone_id: 'WKZ', name: 'Belton Corner, Marine Parade', house_count: 2 },
  { zone_id: 'WKZ', name: 'North Street', house_count: 29 },
  { zone_id: 'WKZ', name: 'Oakleigh Park Drive (Broadway to Pall Mall)', house_count: 58 },
  { zone_id: 'WKZ', name: 'Pall Mall (south side Leigham Court Drive to Elm Road)', house_count: 65 },
  { zone_id: 'WKZ', name: 'Queens Road', house_count: 51 },
  { zone_id: 'WKZ', name: 'Rectory Grove (south side)', house_count: 49 },
  { zone_id: 'WKZ', name: 'Redcliff Drive', house_count: 17 },
  { zone_id: 'WKZ', name: 'Seaview Road', house_count: 35 },
  { zone_id: 'WKZ', name: 'Victoria Road', house_count: 35 },
  { zone_id: 'WKZ', name: 'West Street', house_count: 25 },

  // WLZ - 11 streets, 246 houses
  { zone_id: 'WLZ', name: 'Billet Lane (cottages at the bottom)', house_count: 7 },
  { zone_id: 'WLZ', name: 'Church Hill (all cottages below Old School House & The Terrace)', house_count: 13 },
  { zone_id: 'WLZ', name: 'Hadleigh Road (Leigh Park Road to New Road)', house_count: 23 },
  { zone_id: 'WLZ', name: 'High Street', house_count: 21 },
  { zone_id: 'WLZ', name: 'Hillside Road', house_count: 6 },
  { zone_id: 'WLZ', name: 'Laurel Close', house_count: 17 },
  { zone_id: 'WLZ', name: 'Leigh Hill (Cliff Parade to New Road including Leigh Hill Close & Bell Sands)', house_count: 65 },
  { zone_id: 'WLZ', name: 'Leigh Park Road (Leigh Hill to 13/38)', house_count: 21 },
  { zone_id: 'WLZ', name: 'New Road', house_count: 35 },
  { zone_id: 'WLZ', name: 'The Gardens', house_count: 13 },
  { zone_id: 'WLZ', name: 'Uttons Avenue', house_count: 25 },

  // WMZ - 16 streets, 1170 houses
  { zone_id: 'WMZ', name: 'Chalkwell Park Drive (west side)', house_count: 51 },
  { zone_id: 'WMZ', name: 'Cranleigh Drive', house_count: 92 },
  { zone_id: 'WMZ', name: 'Dawlish Drive', house_count: 86 },
  { zone_id: 'WMZ', name: 'Elm Road (Pall Mall to London Road)', house_count: 130 },
  { zone_id: 'WMZ', name: 'Glendale Gardens (Elm Road to Lymington Avenue)', house_count: 14 },
  { zone_id: 'WMZ', name: 'Leigham Court Drive (Pall Mall to London Road)', house_count: 103 },
  { zone_id: 'WMZ', name: 'Leigh Hall Road (Broadway to London Road)', house_count: 117 },
  { zone_id: 'WMZ', name: 'Leighton Avenue (Pall Mall to London Road)', house_count: 117 },
  { zone_id: 'WMZ', name: 'London Road (south side Oakleigh Park Drive to Lymington Avenue)', house_count: 32 },
  { zone_id: 'WMZ', name: 'Oakleigh Park Drive (Pall Mall to London Road)', house_count: 130 },
  { zone_id: 'WMZ', name: 'Pall Mall (north side Elm Road to Oakleigh Park Drive)', house_count: 96 },
  { zone_id: 'WMZ', name: 'Queens Avenue', house_count: 13 },
  { zone_id: 'WMZ', name: 'Rectory Grove (north side Elm Road to Lymington Avenue)', house_count: 16 },
  { zone_id: 'WMZ', name: 'Station Road', house_count: 67 },
  { zone_id: 'WMZ', name: 'Torquay Drive', house_count: 60 },
  { zone_id: 'WMZ', name: 'Victoria Drive', house_count: 46 },

  // WNZ - 10 streets, 680 houses
  { zone_id: 'WNZ', name: 'Fairleigh Drive', house_count: 84 },
  { zone_id: 'WNZ', name: 'Glendale Gardens (Lymington Avenue to Grange Road/Marine Avenue)', house_count: 86 },
  { zone_id: 'WNZ', name: 'Grange Road (east side)', house_count: 24 },
  { zone_id: 'WNZ', name: 'Leighville Grove', house_count: 66 },
  { zone_id: 'WNZ', name: 'London Road (south side Lymington Avenue to West Leigh Schools)', house_count: 36 },
  { zone_id: 'WNZ', name: 'Lymington Avenue', house_count: 153 },
  { zone_id: 'WNZ', name: 'Marine Avenue (east side)', house_count: 30 },
  { zone_id: 'WNZ', name: 'Rectory Grove (north side Grange Road to Lymington Avenue)', house_count: 30 },
  { zone_id: 'WNZ', name: 'Ronald Hill Grove (Marine Avenue to Southsea Avenue)', house_count: 33 },
  { zone_id: 'WNZ', name: 'Southsea Avenue', house_count: 138 },
];

function seed(db) {
  const zoneCount = db.prepare('SELECT COUNT(*) as count FROM zones').get().count;
  if (zoneCount > 0) return;

  const insertZone = db.prepare('INSERT INTO zones (id, name, color, sort_order) VALUES (?, ?, ?, ?)');
  const insertStreet = db.prepare('INSERT INTO streets (zone_id, name, house_count) VALUES (?, ?, ?)');

  const seedAll = db.transaction(() => {
    for (const z of ZONES) {
      insertZone.run(z.id, z.name, z.color, z.sort_order);
    }
    for (const s of STREETS) {
      insertStreet.run(s.zone_id, s.name, s.house_count);
    }
  });

  seedAll();

  // Verify
  const totals = db.prepare(`
    SELECT zone_id, COUNT(*) as streets, SUM(house_count) as houses
    FROM streets GROUP BY zone_id ORDER BY zone_id
  `).all();
  console.log('Seeded database:');
  let grandTotal = 0;
  for (const t of totals) {
    console.log(`  ${t.zone_id}: ${t.streets} streets, ${t.houses} houses`);
    grandTotal += t.houses;
  }
  console.log(`  Total: ${totals.reduce((s, t) => s + t.streets, 0)} streets, ${grandTotal} houses`);
}

module.exports = { seed };
