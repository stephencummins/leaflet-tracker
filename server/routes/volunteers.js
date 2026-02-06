const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// POST /api/volunteers - register or find by name (idempotent)
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });

  const trimmed = name.trim();

  let volunteer = db.prepare('SELECT * FROM volunteers WHERE name = ?').get(trimmed);
  if (!volunteer) {
    const result = db.prepare('INSERT INTO volunteers (name) VALUES (?)').run(trimmed);
    volunteer = db.prepare('SELECT * FROM volunteers WHERE id = ?').get(result.lastInsertRowid);
  }

  // Get their stats
  const stats = db.prepare(`
    SELECT
      COALESCE(COUNT(*), 0) as streets_delivered,
      COALESCE(SUM(house_count), 0) as houses_delivered,
      COUNT(DISTINCT (SELECT zone_id FROM streets WHERE id = delivery_log.street_id)) as zones_delivered
    FROM delivery_log WHERE volunteer_id = ?
  `).get(volunteer.id);

  res.json({ ...volunteer, ...stats });
});

// GET /api/volunteers - leaderboard
router.get('/', (req, res) => {
  const volunteers = db.prepare(`
    SELECT
      v.id, v.name,
      COALESCE(COUNT(dl.id), 0) as streets_delivered,
      COALESCE(SUM(dl.house_count), 0) as houses_delivered,
      COUNT(DISTINCT (SELECT zone_id FROM streets WHERE id = dl.street_id)) as zones_delivered
    FROM volunteers v
    LEFT JOIN delivery_log dl ON dl.volunteer_id = v.id
    GROUP BY v.id
    HAVING streets_delivered > 0
    ORDER BY houses_delivered DESC
  `).all();

  // Compute achievements for each
  const result = volunteers.map(v => {
    const achievements = [];
    if (v.streets_delivered >= 1) achievements.push('first_delivery');
    if (v.streets_delivered >= 5) achievements.push('high_five');
    if (v.streets_delivered >= 10) achievements.push('street_sweeper');
    if (v.houses_delivered >= 100) achievements.push('century_club');
    if (v.houses_delivered >= 500) achievements.push('postie_pro');
    if (v.zones_delivered >= 3) achievements.push('cross_zone_crusader');
    if (v.zones_delivered >= 5) achievements.push('ward_warrior');

    // Check zone champion - did they complete all streets in any zone?
    const zoneChampion = db.prepare(`
      SELECT z.id FROM zones z
      WHERE (SELECT COUNT(*) FROM streets s WHERE s.zone_id = z.id AND s.is_complete = 0) = 0
        AND (SELECT COUNT(*) FROM delivery_log dl
             JOIN streets s2 ON s2.id = dl.street_id
             WHERE dl.volunteer_id = ? AND s2.zone_id = z.id) > 0
    `).all(v.id);
    if (zoneChampion.length > 0) achievements.push('zone_champion');

    return { ...v, achievements };
  });

  res.json(result);
});

module.exports = router;
