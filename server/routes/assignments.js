const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// POST /api/assignments - assign volunteer to street
router.post('/', (req, res) => {
  const { street_id, volunteer_id } = req.body;
  if (!street_id || !volunteer_id) {
    return res.status(400).json({ error: 'street_id and volunteer_id required' });
  }

  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(street_id);
  if (!street) return res.status(404).json({ error: 'Street not found' });
  if (street.is_complete) return res.status(400).json({ error: 'Street already complete' });

  // Remove existing assignment if any
  db.prepare('DELETE FROM assignments WHERE street_id = ?').run(street_id);

  db.prepare('INSERT INTO assignments (street_id, volunteer_id) VALUES (?, ?)').run(street_id, volunteer_id);

  const assignment = db.prepare(`
    SELECT a.*, v.name as volunteer_name
    FROM assignments a
    JOIN volunteers v ON v.id = a.volunteer_id
    WHERE a.street_id = ?
  `).get(street_id);

  res.json(assignment);
});

// DELETE /api/assignments/:streetId - unassign
router.delete('/:streetId', (req, res) => {
  db.prepare('DELETE FROM assignments WHERE street_id = ?').run(req.params.streetId);
  res.json({ success: true });
});

module.exports = router;
