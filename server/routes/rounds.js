const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/rounds — list all rounds with summary stats
router.get('/', (req, res) => {
  const rounds = db.prepare('SELECT * FROM rounds ORDER BY id DESC').all();

  const stats = rounds.map(round => {
    const summary = db.prepare(`
      SELECT
        COUNT(*) as deliveries,
        COALESCE(SUM(house_count), 0) as houses,
        COUNT(DISTINCT volunteer_id) as volunteers
      FROM delivery_log WHERE round_id = ?
    `).get(round.id);
    return { ...round, ...summary };
  });

  res.json(stats);
});

// GET /api/rounds/active — current active round
router.get('/active', (req, res) => {
  const round = db.prepare('SELECT * FROM rounds WHERE is_active = 1').get();
  if (!round) return res.status(404).json({ error: 'No active round' });
  res.json(round);
});

// GET /api/rounds/:id/stats — full stats for a round
router.get('/:id/stats', (req, res) => {
  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(req.params.id);
  if (!round) return res.status(404).json({ error: 'Round not found' });

  // Ward-level stats
  const wardStats = db.prepare(`
    SELECT
      COUNT(DISTINCT dl.street_id) as streets_delivered,
      COALESCE(SUM(dl.house_count), 0) as houses_delivered
    FROM delivery_log dl WHERE dl.round_id = ?
  `).get(round.id);

  const totalHouses = db.prepare('SELECT SUM(house_count) as total FROM streets').get().total;
  const wardPercent = totalHouses ? Math.round((wardStats.houses_delivered / totalHouses) * 100) : 0;

  // Zone breakdown
  const zones = db.prepare(`
    SELECT
      z.id, z.name, z.color, z.ward,
      COUNT(DISTINCT dl.street_id) as delivered_streets,
      COALESCE(SUM(dl.house_count), 0) as delivered_houses,
      (SELECT COUNT(*) FROM streets s WHERE s.zone_id = z.id) as total_streets,
      (SELECT SUM(s.house_count) FROM streets s WHERE s.zone_id = z.id) as total_houses
    FROM zones z
    LEFT JOIN delivery_log dl ON dl.round_id = ?
      AND dl.street_id IN (SELECT s.id FROM streets s WHERE s.zone_id = z.id)
    GROUP BY z.id
    ORDER BY z.sort_order
  `).all(round.id);

  // Top volunteers
  const topVolunteers = db.prepare(`
    SELECT
      v.id, v.name,
      COUNT(dl.id) as streets_delivered,
      SUM(dl.house_count) as houses_delivered
    FROM volunteers v
    JOIN delivery_log dl ON dl.volunteer_id = v.id AND dl.round_id = ?
    WHERE LOWER(TRIM(v.name)) NOT IN ('stephen', 'stephen cummins')
    GROUP BY v.id
    ORDER BY houses_delivered DESC
    LIMIT 10
  `).all(round.id);

  // Recent activity
  const recent = db.prepare(`
    SELECT
      dl.id, dl.delivered_at,
      s.name as street_name, s.house_count, s.zone_id,
      v.name as volunteer_name,
      z.color as zone_color, z.name as zone_name
    FROM delivery_log dl
    JOIN streets s ON s.id = dl.street_id
    JOIN volunteers v ON v.id = dl.volunteer_id
    JOIN zones z ON z.id = s.zone_id
    WHERE dl.round_id = ?
    ORDER BY dl.delivered_at DESC
    LIMIT 50
  `).all(round.id);

  res.json({
    round,
    wardPercent,
    wardStats,
    zones,
    topVolunteers,
    recent,
  });
});

module.exports = router;
