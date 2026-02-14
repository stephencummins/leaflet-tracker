const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/stats - dashboard data
router.get('/', (req, res) => {
  // Ward totals
  const ward = db.prepare(`
    SELECT
      COUNT(*) as total_streets,
      SUM(house_count) as total_houses,
      SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) as completed_streets,
      SUM(CASE WHEN is_complete = 1 THEN house_count ELSE 0 END) as completed_houses
    FROM streets
  `).get();

  // Zone breakdown
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

  // Recent activity (last 20)
  const recent = db.prepare(`
    SELECT
      dl.id, dl.delivered_at,
      s.name as street_name, s.house_count, s.zone_id,
      v.name as volunteer_name,
      z.color as zone_color
    FROM delivery_log dl
    JOIN streets s ON s.id = dl.street_id
    JOIN volunteers v ON v.id = dl.volunteer_id
    JOIN zones z ON z.id = s.zone_id
    ORDER BY dl.delivered_at DESC
    LIMIT 20
  `).all();

  // Top volunteers
  const topVolunteers = db.prepare(`
    SELECT
      v.id, v.name,
      COUNT(dl.id) as streets_delivered,
      SUM(dl.house_count) as houses_delivered
    FROM volunteers v
    JOIN delivery_log dl ON dl.volunteer_id = v.id
    GROUP BY v.id
    ORDER BY houses_delivered DESC
    LIMIT 5
  `).all();

  res.json({ ward, zones, recent, topVolunteers });
});

module.exports = router;
