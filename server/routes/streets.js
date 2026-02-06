const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// POST /api/streets/:id/complete
router.post('/:id/complete', (req, res) => {
  const { volunteer_id } = req.body;
  if (!volunteer_id) return res.status(400).json({ error: 'volunteer_id required' });

  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });
  if (street.is_complete) return res.status(400).json({ error: 'Street already complete' });

  const complete = db.transaction(() => {
    const now = new Date().toISOString();

    // Mark street complete
    db.prepare(`
      UPDATE streets SET is_complete = 1, completed_at = ?, completed_by = ? WHERE id = ?
    `).run(now, volunteer_id, street.id);

    // Insert delivery log
    db.prepare(`
      INSERT INTO delivery_log (street_id, volunteer_id, house_count, delivered_at)
      VALUES (?, ?, ?, ?)
    `).run(street.id, volunteer_id, street.house_count, now);

    // Remove assignment if any
    db.prepare('DELETE FROM assignments WHERE street_id = ?').run(street.id);

    // Compute stats for response
    const wardStats = db.prepare(`
      SELECT
        SUM(house_count) as total_houses,
        SUM(CASE WHEN is_complete = 1 THEN house_count ELSE 0 END) as completed_houses
      FROM streets
    `).get();

    const wardPercent = Math.round((wardStats.completed_houses / wardStats.total_houses) * 100);

    // Check zone completion
    const zoneStats = db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) as done
      FROM streets WHERE zone_id = ?
    `).get(street.zone_id);
    const zoneComplete = zoneStats.total === zoneStats.done;

    // Compute volunteer achievements
    const volunteerStats = db.prepare(`
      SELECT
        COUNT(*) as streets_delivered,
        SUM(house_count) as houses_delivered,
        COUNT(DISTINCT (SELECT zone_id FROM streets WHERE id = delivery_log.street_id)) as zones_delivered
      FROM delivery_log WHERE volunteer_id = ?
    `).get(volunteer_id);

    const achievements = computeAchievements(volunteerStats, zoneComplete);

    return {
      street: { ...street, is_complete: 1, completed_at: now, completed_by: volunteer_id },
      ward_percent: wardPercent,
      zone_complete: zoneComplete,
      volunteer_stats: volunteerStats,
      achievements,
    };
  });

  const result = complete();
  res.json(result);
});

// POST /api/streets/:id/uncomplete
router.post('/:id/uncomplete', (req, res) => {
  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });
  if (!street.is_complete) return res.status(400).json({ error: 'Street not complete' });

  const uncomplete = db.transaction(() => {
    db.prepare('UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL WHERE id = ?').run(street.id);

    // Remove the most recent delivery log entry for this street
    db.prepare(`
      DELETE FROM delivery_log WHERE id = (
        SELECT id FROM delivery_log WHERE street_id = ? ORDER BY delivered_at DESC LIMIT 1
      )
    `).run(street.id);

    return { success: true };
  });

  uncomplete();
  res.json({ success: true });
});

function computeAchievements(stats, zoneComplete) {
  const achievements = [];
  if (stats.streets_delivered >= 1) achievements.push('first_delivery');
  if (stats.streets_delivered >= 5) achievements.push('high_five');
  if (stats.streets_delivered >= 10) achievements.push('street_sweeper');
  if (stats.houses_delivered >= 100) achievements.push('century_club');
  if (stats.houses_delivered >= 500) achievements.push('postie_pro');
  if (zoneComplete) achievements.push('zone_champion');
  if (stats.zones_delivered >= 3) achievements.push('cross_zone_crusader');
  if (stats.zones_delivered >= 8) achievements.push('ward_warrior');
  return achievements;
}

module.exports = router;
