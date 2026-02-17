const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/walks
router.get('/', (req, res) => {
  const walks = db.prepare(`
    SELECT
      w.id, w.name, w.description,
      COUNT(ws.street_id) as street_count,
      COALESCE(SUM(s.house_count), 0) as house_count,
      COALESCE(SUM(CASE WHEN s.is_complete = 1 THEN 1 ELSE 0 END), 0) as completed_count
    FROM walks w
    LEFT JOIN walk_streets ws ON ws.walk_id = w.id
    LEFT JOIN streets s ON s.id = ws.street_id
    GROUP BY w.id
    ORDER BY w.name
  `).all();
  res.json(walks);
});

// GET /api/walks/:id
router.get('/:id', (req, res) => {
  const walk = db.prepare('SELECT * FROM walks WHERE id = ?').get(req.params.id);
  if (!walk) return res.status(404).json({ error: 'Walk not found' });

  const streets = db.prepare(`
    SELECT s.id, s.name, s.house_count, s.is_complete, s.latitude, s.longitude,
           s.zone_id, z.color as zone_color,
           v.name as completed_by_name
    FROM walk_streets ws
    JOIN streets s ON s.id = ws.street_id
    JOIN zones z ON z.id = s.zone_id
    LEFT JOIN volunteers v ON v.id = s.completed_by
    WHERE ws.walk_id = ?
    ORDER BY ws.sort_order, s.name
  `).all(req.params.id);

  res.json({ ...walk, streets });
});

module.exports = router;
