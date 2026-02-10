const ZONES = [
  { id: 'WJZ', name: 'Zone WJZ', color: '#E63946', sort_order: 1 },
  { id: 'WLZ', name: 'Zone WLZ', color: '#E9C46A', sort_order: 2 },
  { id: 'WNZ', name: 'Zone WNZ', color: '#7B2D8E', sort_order: 3 },
  { id: 'WOZ', name: 'Zone WOZ', color: '#457B9D', sort_order: 4 },
  { id: 'WPZ', name: 'Zone WPZ', color: '#2A9D8F', sort_order: 5 },
  { id: 'WQZ', name: 'Zone WQZ', color: '#E76F51', sort_order: 6 },
  { id: 'WRZ', name: 'Zone WRZ', color: '#264653', sort_order: 7 },
  { id: 'WSZ', name: 'Zone WSZ', color: '#F4A261', sort_order: 8 },
];

const STREETS = [
  // WJZ - 18 streets (Leigh)
  { zone_id: 'WJZ', name: 'Chalkwell Park Drive', house_count: 104 },
  { zone_id: 'WJZ', name: 'Cliffsea Grove', house_count: 94 },
  { zone_id: 'WJZ', name: 'Dundonald Drive', house_count: 81 },
  { zone_id: 'WJZ', name: 'Grand Drive (even only)', house_count: 40 },
  { zone_id: 'WJZ', name: 'Grand Parade', house_count: 120 },
  { zone_id: 'WJZ', name: 'Highcliff Drive', house_count: 67 },
  { zone_id: 'WJZ', name: 'Hillside Crescent', house_count: 32 },
  { zone_id: 'WJZ', name: 'Leigh Road', house_count: 124 },
  { zone_id: 'WJZ', name: 'Leighcliff Road / Maple Avenue / Victor Drive', house_count: 125 },
  { zone_id: 'WJZ', name: 'London Road', house_count: 23 },
  { zone_id: 'WJZ', name: 'Lord Roberts Avenue', house_count: 107 },
  { zone_id: 'WJZ', name: 'Marguerite Drive', house_count: 105 },
  { zone_id: 'WJZ', name: 'Portchester Court', house_count: 45 },
  { zone_id: 'WJZ', name: 'Somerville Gardens / Carlton Drive / Nelson Drive', house_count: 99 },
  { zone_id: 'WJZ', name: 'Undercliff Gardens', house_count: 78 },
  { zone_id: 'WJZ', name: 'Woodfield Gardens', house_count: 32 },
  { zone_id: 'WJZ', name: 'Woodfield Park Drive', house_count: 42 },
  { zone_id: 'WJZ', name: 'Woodfield Road / Glen Road', house_count: 79 },

  // WLZ - 6 streets (Leigh)
  { zone_id: 'WLZ', name: 'Church Hill / Leigh Hill Close / The Gardens', house_count: 52 },
  { zone_id: 'WLZ', name: 'Hadleigh Road', house_count: 30 },
  { zone_id: 'WLZ', name: 'High Street (up to 60-62 and 77)', house_count: 79 },
  { zone_id: 'WLZ', name: 'Leigh Park Road', house_count: 58 },
  { zone_id: 'WLZ', name: 'New Road / Billet Lane / Laurel Close', house_count: 71 },
  { zone_id: 'WLZ', name: 'Uttons Avenue', house_count: 28 },

  // WNZ - 7 streets (Leigh)
  { zone_id: 'WNZ', name: 'Fairleigh Drive', house_count: 91 },
  { zone_id: 'WNZ', name: 'Glendale Gardens', house_count: 97 },
  { zone_id: 'WNZ', name: 'Grange Road', house_count: 26 },
  { zone_id: 'WNZ', name: 'Leighville Grove', house_count: 75 },
  { zone_id: 'WNZ', name: 'London Road (1152-1188)', house_count: 36 },
  { zone_id: 'WNZ', name: 'Marine Avenue', house_count: 33 },
  { zone_id: 'WNZ', name: 'Ronald Hill Grove', house_count: 37 },

  // WOZ - 8 streets (West Leigh)
  { zone_id: 'WOZ', name: 'Glendale Gardens', house_count: 50 },
  { zone_id: 'WOZ', name: 'Grange Road', house_count: 30 },
  { zone_id: 'WOZ', name: 'Marine Avenue', house_count: 40 },
  { zone_id: 'WOZ', name: 'Marine Parade', house_count: 50 },
  { zone_id: 'WOZ', name: 'Percy Road', house_count: 40 },
  { zone_id: 'WOZ', name: 'Ronald Hill Grove', house_count: 30 },
  { zone_id: 'WOZ', name: 'Salisbury Road', house_count: 30 },
  { zone_id: 'WOZ', name: 'Westcliff Drive', house_count: 34 },

  // WPZ - 17 streets (West Leigh)
  { zone_id: 'WPZ', name: 'Burnham Road', house_count: 79 },
  { zone_id: 'WPZ', name: 'Canvey Road / Ray Walk / Ray Close', house_count: 102 },
  { zone_id: 'WPZ', name: 'Crescent Road / Hamboro Gardens', house_count: 106 },
  { zone_id: 'WPZ', name: 'Hadleigh Road (London Rd to Glendale/Western)', house_count: 110 },
  { zone_id: 'WPZ', name: 'Harley Street', house_count: 80 },
  { zone_id: 'WPZ', name: 'Hazel Close', house_count: 30 },
  { zone_id: 'WPZ', name: 'Herschell Road', house_count: 100 },
  { zone_id: 'WPZ', name: 'Lambeth Gardens', house_count: 60 },
  { zone_id: 'WPZ', name: 'Lapwater Close', house_count: 50 },
  { zone_id: 'WPZ', name: 'Leigh Park Close', house_count: 40 },
  { zone_id: 'WPZ', name: 'London Road', house_count: 120 },
  { zone_id: 'WPZ', name: 'Marine Parade', house_count: 80 },
  { zone_id: 'WPZ', name: 'Park Road', house_count: 70 },
  { zone_id: 'WPZ', name: 'Salisbury Road', house_count: 60 },
  { zone_id: 'WPZ', name: 'Theobalds Road', house_count: 50 },
  { zone_id: 'WPZ', name: 'Vernon Road', house_count: 40 },
  { zone_id: 'WPZ', name: 'Western Road', house_count: 27 },

  // WQZ - 13 streets (West Leigh)
  { zone_id: 'WQZ', name: 'Berkeley Gardens', house_count: 55 },
  { zone_id: 'WQZ', name: 'Chapmans Walk / Chapmans Close', house_count: 55 },
  { zone_id: 'WQZ', name: 'Cottismore Gardens', house_count: 60 },
  { zone_id: 'WQZ', name: 'Dynevor Gardens / Dale Road', house_count: 39 },
  { zone_id: 'WQZ', name: 'Leigh Heath Court', house_count: 43 },
  { zone_id: 'WQZ', name: 'London Road (south side)', house_count: 72 },
  { zone_id: 'WQZ', name: 'Marine Close', house_count: 40 },
  { zone_id: 'WQZ', name: 'Marine Parade', house_count: 55 },
  { zone_id: 'WQZ', name: 'Medway Crescent / Darenth Road', house_count: 55 },
  { zone_id: 'WQZ', name: 'Quorn Gardens', house_count: 65 },
  { zone_id: 'WQZ', name: 'Tattersall Gardens', house_count: 97 },
  { zone_id: 'WQZ', name: 'Thames Drive / Thames Close', house_count: 85 },
  { zone_id: 'WQZ', name: 'Western Road', house_count: 90 },

  // WRZ - 13 streets (West Leigh)
  { zone_id: 'WRZ', name: 'Bailey Road', house_count: 55 },
  { zone_id: 'WRZ', name: 'Barnard Road', house_count: 23 },
  { zone_id: 'WRZ', name: 'Cameron Close / Dundee Avenue / Dundee Close / Forfar Close', house_count: 45 },
  { zone_id: 'WRZ', name: 'Eaton Road', house_count: 50 },
  { zone_id: 'WRZ', name: 'Edinburgh Avenue', house_count: 53 },
  { zone_id: 'WRZ', name: 'Gordon Road', house_count: 29 },
  { zone_id: 'WRZ', name: 'Highlands Blvd / Herschell Road', house_count: 80 },
  { zone_id: 'WRZ', name: 'Lime Avenue / Fairview Gardens / Foxwood Place / Underwood Square', house_count: 86 },
  { zone_id: 'WRZ', name: 'London Road (north side Stirling-Eastwood)', house_count: 122 },
  { zone_id: 'WRZ', name: 'Montague Avenue', house_count: 45 },
  { zone_id: 'WRZ', name: 'Southsea Avenue', house_count: 61 },
  { zone_id: 'WRZ', name: 'Sydney Road', house_count: 40 },
  { zone_id: 'WRZ', name: 'Vardon Drive', house_count: 0 },

  // WSZ - 15 streets (West Leigh)
  { zone_id: 'WSZ', name: 'Adalia Crescent', house_count: 68 },
  { zone_id: 'WSZ', name: 'Agnes Avenue / Adalia Way', house_count: 47 },
  { zone_id: 'WSZ', name: 'Braemar Crescent / Aberdeen Gardens / Hamilton Close', house_count: 79 },
  { zone_id: 'WSZ', name: 'Buxton Avenue / Buxton Close / Cosgrove Avenue', house_count: 73 },
  { zone_id: 'WSZ', name: 'Doris / Ormonde Gardens', house_count: 46 },
  { zone_id: 'WSZ', name: 'Ewan Way / Ewan Close', house_count: 27 },
  { zone_id: 'WSZ', name: 'Henry Drive / Tennyson Close', house_count: 49 },
  { zone_id: 'WSZ', name: 'Highlands Blvd (115+)', house_count: 136 },
  { zone_id: 'WSZ', name: 'London Road (north side 1713+)', house_count: 66 },
  { zone_id: 'WSZ', name: 'Olive Avenue', house_count: 90 },
  { zone_id: 'WSZ', name: 'Stirling Avenue', house_count: 34 },
  { zone_id: 'WSZ', name: 'Sutherland Blvd', house_count: 34 },
  { zone_id: 'WSZ', name: 'Vardon Drive / Marshall Close', house_count: 71 },
  { zone_id: 'WSZ', name: 'Walker Drive', house_count: 46 },
  { zone_id: 'WSZ', name: 'Woodlands Park / Warren Road / Sylvan Way', house_count: 58 },
];

// Streets already delivered (from CSV — corrected Feb 10)
const DELIVERIES = [
  // WJZ - Granville Stride (his actual round — 9 streets)
  { street: 'Dundonald Drive', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Highcliff Drive', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Hillside Crescent', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Leigh Road', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'London Road', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Somerville Gardens / Carlton Drive / Nelson Drive', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Woodfield Gardens', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Woodfield Park Drive', zone: 'WJZ', volunteer: 'Granville Stride' },
  { street: 'Woodfield Road / Glen Road', zone: 'WJZ', volunteer: 'Granville Stride' },
  // WJZ - Robert Howes (just Undercliff Gardens)
  { street: 'Undercliff Gardens', zone: 'WJZ', volunteer: 'Robert Howes' },
  // WJZ - Martha
  { street: 'Leighcliff Road / Maple Avenue / Victor Drive', zone: 'WJZ', volunteer: 'Martha' },
  // WJZ - Cavan
  { street: 'Lord Roberts Avenue', zone: 'WJZ', volunteer: 'Cavan' },
  // NOTE: Chalkwell Park Drive, Cliffsea Grove, Grand Drive (even only),
  //       Grand Parade, Marguerite Drive, Portchester Court are NOT delivered

  // WLZ - Andy Wilkins
  { street: 'Church Hill / Leigh Hill Close / The Gardens', zone: 'WLZ', volunteer: 'Andy Wilkins' },
  { street: 'Hadleigh Road', zone: 'WLZ', volunteer: 'Andy Wilkins' },
  { street: 'High Street (up to 60-62 and 77)', zone: 'WLZ', volunteer: 'Andy Wilkins' },
  { street: 'Leigh Park Road', zone: 'WLZ', volunteer: 'Andy Wilkins' },
  { street: 'New Road / Billet Lane / Laurel Close', zone: 'WLZ', volunteer: 'Andy Wilkins' },
  { street: 'Uttons Avenue', zone: 'WLZ', volunteer: 'Andy Wilkins' },

  // WNZ - Carole Mulroney
  { street: 'Fairleigh Drive', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'Glendale Gardens', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'Grange Road', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'Leighville Grove', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'London Road (1152-1188)', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'Marine Avenue', zone: 'WNZ', volunteer: 'Carole Mulroney' },
  { street: 'Ronald Hill Grove', zone: 'WNZ', volunteer: 'Carole Mulroney' },

  // WOZ - all undelivered per newest CSV
];

function seed(db) {
  const zoneCount = db.prepare('SELECT COUNT(*) as c FROM zones').get().c;
  if (zoneCount > 0) return;

  const insertZone = db.prepare(
    'INSERT INTO zones (id, name, color, sort_order) VALUES (?, ?, ?, ?)'
  );
  const insertStreet = db.prepare(
    'INSERT INTO streets (zone_id, name, house_count) VALUES (?, ?, ?)'
  );

  const txn = db.transaction(() => {
    for (const z of ZONES) {
      insertZone.run(z.id, z.name, z.color, z.sort_order);
    }
    for (const s of STREETS) {
      insertStreet.run(s.zone_id, s.name, s.house_count);
    }

    // Register volunteers and mark deliveries
    const insertVol = db.prepare(
      'INSERT OR IGNORE INTO volunteers (name) VALUES (?)'
    );
    const getVol = db.prepare('SELECT id FROM volunteers WHERE name = ?');
    const getStreet = db.prepare(
      'SELECT id, house_count FROM streets WHERE name = ? AND zone_id = ?'
    );
    const markComplete = db.prepare(
      "UPDATE streets SET is_complete = 1, completed_at = datetime('now'), completed_by = ? WHERE id = ?"
    );
    const insertLog = db.prepare(
      'INSERT INTO delivery_log (street_id, volunteer_id, house_count) VALUES (?, ?, ?)'
    );

    for (const d of DELIVERIES) {
      insertVol.run(d.volunteer);
      const vol = getVol.get(d.volunteer);
      const street = getStreet.get(d.street, d.zone);
      if (vol && street) {
        markComplete.run(vol.id, street.id);
        insertLog.run(street.id, vol.id, street.house_count);
      }
    }
  });

  txn();

  const total = db.prepare('SELECT SUM(house_count) as t FROM streets').get().t;
  const delivered = db.prepare('SELECT COUNT(*) as c FROM streets WHERE is_complete = 1').get().c;
  console.log(`Seeded ${ZONES.length} zones, ${STREETS.length} streets, ${total} houses. ${delivered} streets already delivered.`);
}

module.exports = { seed };
