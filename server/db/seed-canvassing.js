const db = require('./connection');

const existing = db.prepare('SELECT COUNT(*) as cnt FROM canvass_groups').get();
if (existing.cnt > 0) {
  console.log('Canvassing data already seeded, skipping.');
  process.exit(0);
}

const groups = [
  {
    number: 1, name: 'Leigh Road South Side', assignee: 'Anita Forde', week: 2,
    roads: [
      'Leigh Road (No. 2-50 South)',
      'Station Approach',
      'Church Hill',
      'Rectory Grove',
      'Victoria Road',
      'Grand Parade',
      'Marine Parade',
      'Elm Avenue',
      'Cliff Parade',
      'Chalkwell Avenue',
      'Thames Drive',
      'Canterbury Avenue',
    ],
  },
  {
    number: 2, name: 'Leigh Road North Side', assignee: 'Anita Forde', week: 1,
    roads: [
      'Leigh Road (No. 1-49 North)',
      'London Road (North)',
      'Manchester Drive',
      'Belfairs Drive',
      'Hadleigh Road',
      'The Drive',
      'Highlands Boulevard',
    ],
  },
  {
    number: 3, name: 'Broadway North / Pall Mall South', assignee: 'Michael', week: 3,
    roads: [
      'The Broadway (North 1-30)',
      'The Broadway (North 31-60)',
      'Pall Mall (South 1-20)',
      'Pall Mall (South 21-40)',
      'Elm Road',
      'North Street',
      'South Street',
      'Park Lane',
      'Kiln Road',
      'Elm Way',
      'The Broadway Mews',
    ],
  },
  {
    number: 4, name: 'Broadway South Side', assignee: 'Andy', week: 5,
    roads: [
      'The Broadway (South 1-30)',
      'The Broadway (South 31-60)',
      'South View Road',
      'Harbour Road',
      'Leigh Hill',
      'Wesley Road',
      'Billet Lane',
      'Sparrow Lane',
    ],
  },
  {
    number: 5, name: 'Pall Mall North to London Road', assignee: 'Sam', week: 4,
    roads: [
      'Pall Mall (North 1-25)',
      'Pall Mall (North 26-50)',
      'London Road (East)',
      'London Road (West)',
      'Leigh Gardens',
      'Western Road',
      'Brighton Road',
      'Southsea Avenue',
      'Cliffsea Grove',
      'Chalkwell Esplanade',
      'Fernlea Avenue',
    ],
  },
  {
    number: 6, name: 'Elm Road', assignee: 'Michael', week: 6,
    roads: [
      'Elm Road',
      'Elm Close',
    ],
  },
  {
    number: 7, name: 'Glendale Gardens', assignee: 'Sam', week: 7,
    roads: [
      'Glendale Gardens',
      'Glendale Close',
      'Glendale Road',
      'The Leas',
      'Eastwood Road North',
      'Hadleigh Road South',
      'Eastwood Boulevard',
      'Marshalls Road',
      'Gorse Road',
    ],
  },
  {
    number: 8, name: 'Broadway West', assignee: 'Andy', week: 8,
    roads: [
      'Broadway West',
      'Leigh Road West',
      'Woodfield Road',
    ],
  },
  {
    number: 9, name: 'Seafront and Old Town', assignee: 'Carole', week: 9,
    roads: [
      'Old Town High Street',
      'Leigh Beck Lane',
      'Strand Wharf',
      'Old Leigh Road',
      'Clifftown Parade',
      'Old Town Walk',
      'The Croft',
    ],
  },
];

const insertGroup = db.prepare(
  'INSERT INTO canvass_groups (number, name, assignee, week) VALUES (?, ?, ?, ?)'
);
const insertRoad = db.prepare(
  'INSERT INTO canvass_roads (group_id, name, sort_order) VALUES (?, ?, ?)'
);

const seedAll = db.transaction(() => {
  for (const g of groups) {
    const result = insertGroup.run(g.number, g.name, g.assignee, g.week);
    const groupId = result.lastInsertRowid;
    g.roads.forEach((road, i) => {
      insertRoad.run(groupId, road, i);
    });
  }
});

seedAll();
console.log('Canvassing data seeded successfully.');
process.exit(0);
