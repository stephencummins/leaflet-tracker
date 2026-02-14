const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/zones - all zones with aggregated stats
router.get('/', (req, res) => {
  const zones = db.prepare(`
    SELECT
      z.id, z.name, z.color, z.sort_order, z.ward,
      COUNT(s.id) as total_streets,
      SUM(s.house_count) as total_houses,
      SUM(CASE WHEN s.is_complete = 1 THEN 1 ELSE 0 END) as completed_streets,
      SUM(CASE WHEN s.is_complete = 1 THEN s.house_count ELSE 0 END) as completed_houses
    FROM zones z
    LEFT JOIN streets s ON s.zone_id = z.id
    GROUP BY z.id
    ORDER BY z.sort_order
  `).all();
  res.json(zones);
});

// GET /api/zones/:zoneId - zone detail with all streets + assignments
router.get('/:zoneId', (req, res) => {
  const zone = db.prepare('SELECT * FROM zones WHERE id = ?').get(req.params.zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const streets = db.prepare(`
    SELECT
      s.*,
      a.volunteer_id as assigned_volunteer_id,
      av.name as assigned_volunteer_name,
      cv.name as completed_by_name
    FROM streets s
    LEFT JOIN assignments a ON a.street_id = s.id
    LEFT JOIN volunteers av ON av.id = a.volunteer_id
    LEFT JOIN volunteers cv ON cv.id = s.completed_by
    WHERE s.zone_id = ?
    ORDER BY s.name
  `).all(req.params.zoneId);

  res.json({ ...zone, streets });
});

module.exports = router;
