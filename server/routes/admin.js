const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/admin/auth-check
router.get('/auth-check', (req, res) => {
  res.json({ ok: true, email: req.adminEmail });
});

// GET /api/admin/overview
router.get('/overview', (req, res) => {
  const ward = db.prepare(`
    SELECT
      COUNT(*) as total_streets,
      SUM(house_count) as total_houses,
      SUM(CASE WHEN is_complete = 1 THEN 1 ELSE 0 END) as completed_streets,
      SUM(CASE WHEN is_complete = 1 THEN house_count ELSE 0 END) as completed_houses
    FROM streets
  `).get();

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

  const volunteerCount = db.prepare('SELECT COUNT(*) as count FROM volunteers').get().count;

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
    ORDER BY dl.delivered_at DESC
    LIMIT 50
  `).all();

  res.json({ ward, zones, volunteerCount, recent });
});

// GET /api/admin/volunteers
router.get('/volunteers', (req, res) => {
  const volunteers = db.prepare(`
    SELECT
      v.id, v.name, v.notes, v.created_at,
      COALESCE(COUNT(dl.id), 0) as streets_delivered,
      COALESCE(SUM(dl.house_count), 0) as houses_delivered,
      COUNT(DISTINCT (SELECT zone_id FROM streets WHERE id = dl.street_id)) as zones_delivered,
      (SELECT COUNT(*) FROM assignments a WHERE a.volunteer_id = v.id) as active_assignments
    FROM volunteers v
    LEFT JOIN delivery_log dl ON dl.volunteer_id = v.id
    GROUP BY v.id
    ORDER BY v.name
  `).all();

  res.json(volunteers);
});

// GET /api/admin/volunteers/:id
router.get('/volunteers/:id', (req, res) => {
  const volunteer = db.prepare('SELECT * FROM volunteers WHERE id = ?').get(req.params.id);
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

  const completed = db.prepare(`
    SELECT s.id, s.name, s.zone_id, z.name as zone_name, z.color as zone_color,
           s.house_count, dl.delivered_at as completed_at
    FROM delivery_log dl
    JOIN streets s ON s.id = dl.street_id
    JOIN zones z ON z.id = s.zone_id
    WHERE dl.volunteer_id = ?
    ORDER BY dl.delivered_at DESC
  `).all(volunteer.id);

  const assigned = db.prepare(`
    SELECT s.id, s.name, s.zone_id, z.name as zone_name, z.color as zone_color,
           s.house_count, a.assigned_at
    FROM assignments a
    JOIN streets s ON s.id = a.street_id
    JOIN zones z ON z.id = s.zone_id
    WHERE a.volunteer_id = ?
    ORDER BY a.assigned_at DESC
  `).all(volunteer.id);

  const totals = {
    streets_completed: completed.length,
    houses_completed: completed.reduce((sum, s) => sum + s.house_count, 0),
    streets_assigned: assigned.length,
    houses_assigned: assigned.reduce((sum, s) => sum + s.house_count, 0),
  };

  res.json({ volunteer, completed, assigned, totals });
});

// PUT /api/admin/volunteers/:id
router.put('/volunteers/:id', (req, res) => {
  const { name, notes } = req.body;
  const volunteer = db.prepare('SELECT * FROM volunteers WHERE id = ?').get(req.params.id);
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed) return res.status(400).json({ error: 'Name cannot be empty' });
    db.prepare('UPDATE volunteers SET name = ? WHERE id = ?').run(trimmed, volunteer.id);
  }
  if (notes !== undefined) {
    db.prepare('UPDATE volunteers SET notes = ? WHERE id = ?').run(notes, volunteer.id);
  }

  const updated = db.prepare('SELECT * FROM volunteers WHERE id = ?').get(volunteer.id);
  res.json(updated);
});

// DELETE /api/admin/volunteers/:id
router.delete('/volunteers/:id', (req, res) => {
  const volunteer = db.prepare('SELECT * FROM volunteers WHERE id = ?').get(req.params.id);
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

  const cleanup = db.transaction(() => {
    // Remove assignments
    db.prepare('DELETE FROM assignments WHERE volunteer_id = ?').run(volunteer.id);
    // Remove delivery log entries
    db.prepare('DELETE FROM delivery_log WHERE volunteer_id = ?').run(volunteer.id);
    // Clear completed_by references on streets
    db.prepare('UPDATE streets SET completed_by = NULL WHERE completed_by = ?').run(volunteer.id);
    // Delete volunteer
    db.prepare('DELETE FROM volunteers WHERE id = ?').run(volunteer.id);
  });

  cleanup();
  res.json({ success: true });
});

// GET /api/admin/streets
router.get('/streets', (req, res) => {
  const { zone_id } = req.query;

  let query = `
    SELECT
      s.id, s.name, s.zone_id, s.house_count,
      s.is_complete, s.completed_at, s.completed_by,
      z.name as zone_name, z.color as zone_color,
      a.volunteer_id as assigned_volunteer_id,
      av.name as assigned_volunteer_name,
      cv.name as completed_by_name
    FROM streets s
    JOIN zones z ON z.id = s.zone_id
    LEFT JOIN assignments a ON a.street_id = s.id
    LEFT JOIN volunteers av ON av.id = a.volunteer_id
    LEFT JOIN volunteers cv ON cv.id = s.completed_by
  `;

  const params = [];
  if (zone_id) {
    query += ' WHERE s.zone_id = ?';
    params.push(zone_id);
  }

  query += ' ORDER BY z.sort_order, s.name';

  const streets = db.prepare(query).all(...params);
  const zones = db.prepare('SELECT id, name, ward FROM zones ORDER BY sort_order').all();
  const volunteers = db.prepare('SELECT id, name FROM volunteers ORDER BY name').all();

  res.json({ streets, zones, volunteers });
});

// PUT /api/admin/streets/:id
router.put('/streets/:id', (req, res) => {
  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });

  const { name, house_count } = req.body;
  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed) return res.status(400).json({ error: 'Name cannot be empty' });
    db.prepare('UPDATE streets SET name = ? WHERE id = ?').run(trimmed, street.id);
  }
  if (house_count !== undefined) {
    const count = parseInt(house_count, 10);
    if (isNaN(count) || count < 0) return res.status(400).json({ error: 'Invalid house count' });
    db.prepare('UPDATE streets SET house_count = ? WHERE id = ?').run(count, street.id);
  }

  const updated = db.prepare('SELECT * FROM streets WHERE id = ?').get(street.id);
  res.json(updated);
});

// POST /api/admin/streets/:id/complete
router.post('/streets/:id/complete', (req, res) => {
  const { volunteer_id } = req.body;
  if (!volunteer_id) return res.status(400).json({ error: 'volunteer_id required' });

  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });
  if (street.is_complete) return res.status(400).json({ error: 'Already complete' });

  const complete = db.transaction(() => {
    const now = new Date().toISOString();
    db.prepare('UPDATE streets SET is_complete = 1, completed_at = ?, completed_by = ? WHERE id = ?')
      .run(now, volunteer_id, street.id);
    db.prepare('INSERT INTO delivery_log (street_id, volunteer_id, house_count, delivered_at) VALUES (?, ?, ?, ?)')
      .run(street.id, volunteer_id, street.house_count, now);
    db.prepare('DELETE FROM assignments WHERE street_id = ?').run(street.id);
  });

  complete();
  res.json({ success: true });
});

// POST /api/admin/streets/:id/uncomplete
router.post('/streets/:id/uncomplete', (req, res) => {
  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });
  if (!street.is_complete) return res.status(400).json({ error: 'Not complete' });

  const uncomplete = db.transaction(() => {
    db.prepare('UPDATE streets SET is_complete = 0, completed_at = NULL, completed_by = NULL WHERE id = ?')
      .run(street.id);
    db.prepare(`
      DELETE FROM delivery_log WHERE id = (
        SELECT id FROM delivery_log WHERE street_id = ? ORDER BY delivered_at DESC LIMIT 1
      )
    `).run(street.id);
  });

  uncomplete();
  res.json({ success: true });
});

// POST /api/admin/streets/:id/assign
router.post('/streets/:id/assign', (req, res) => {
  const { volunteer_id } = req.body;
  if (!volunteer_id) return res.status(400).json({ error: 'volunteer_id required' });

  const street = db.prepare('SELECT * FROM streets WHERE id = ?').get(req.params.id);
  if (!street) return res.status(404).json({ error: 'Street not found' });

  db.prepare('DELETE FROM assignments WHERE street_id = ?').run(street.id);
  db.prepare('INSERT INTO assignments (street_id, volunteer_id) VALUES (?, ?)').run(street.id, volunteer_id);

  res.json({ success: true });
});

// DELETE /api/admin/streets/:id/assign
router.delete('/streets/:id/assign', (req, res) => {
  db.prepare('DELETE FROM assignments WHERE street_id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/admin/export/streets.csv
router.get('/export/streets.csv', (req, res) => {
  const { zone_id } = req.query;
  const sql = `
    SELECT z.id as zone_id, s.name, s.house_count, s.is_complete,
           v_assigned.name as assigned_to,
           v_completed.name as completed_by, s.completed_at
    FROM streets s
    JOIN zones z ON z.id = s.zone_id
    LEFT JOIN assignments a ON a.street_id = s.id
    LEFT JOIN volunteers v_assigned ON v_assigned.id = a.volunteer_id
    LEFT JOIN volunteers v_completed ON v_completed.id = s.completed_by
    ${zone_id ? 'WHERE s.zone_id = ?' : ''}
    ORDER BY z.sort_order, s.name
  `;
  const rows = db.prepare(sql).all(...(zone_id ? [zone_id] : []));
  const header = 'Zone,Street,Houses,Status,Assigned To,Completed By,Completed At\n';
  const body = rows.map(r => [
    r.zone_id,
    `"${r.name.replace(/"/g, '""')}"`,
    r.house_count,
    r.is_complete ? 'Complete' : 'Incomplete',
    r.assigned_to || '',
    r.completed_by || '',
    r.completed_at ? r.completed_at.slice(0, 10) : '',
  ].join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="streets${zone_id ? '-' + zone_id : ''}.csv"`);
  res.send(header + body);
});

// ============================================================
// Walks admin CRUD
// ============================================================

// GET /api/admin/walks
router.get('/walks', (req, res) => {
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

// POST /api/admin/walks
router.post('/walks', (req, res) => {
  const { name, description, street_ids } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const insert = db.transaction(() => {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO walks (name, description) VALUES (?, ?)'
    ).run(name, description || null);

    if (Array.isArray(street_ids)) {
      const insertStreet = db.prepare(
        'INSERT INTO walk_streets (walk_id, street_id, sort_order) VALUES (?, ?, ?)'
      );
      street_ids.forEach((sid, i) => insertStreet.run(lastInsertRowid, sid, i));
    }
    return lastInsertRowid;
  });

  const id = insert();
  res.json({ id });
});

// PUT /api/admin/walks/:id
router.put('/walks/:id', (req, res) => {
  const { name, description, street_ids } = req.body;
  const { id } = req.params;

  const update = db.transaction(() => {
    if (name !== undefined || description !== undefined) {
      db.prepare('UPDATE walks SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?')
        .run(name || null, description !== undefined ? description : undefined, id);
    }
    if (Array.isArray(street_ids)) {
      db.prepare('DELETE FROM walk_streets WHERE walk_id = ?').run(id);
      const insertStreet = db.prepare(
        'INSERT INTO walk_streets (walk_id, street_id, sort_order) VALUES (?, ?, ?)'
      );
      street_ids.forEach((sid, i) => insertStreet.run(id, sid, i));
    }
  });

  update();
  res.json({ success: true });
});

// DELETE /api/admin/walks/:id
router.delete('/walks/:id', (req, res) => {
  db.prepare('DELETE FROM walks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /api/admin/candidates
router.get('/candidates', (req, res) => {
  const candidates = db.prepare('SELECT * FROM candidates ORDER BY ward').all();
  res.json(candidates);
});

// PUT /api/admin/candidates/:id
router.put('/candidates/:id', (req, res) => {
  const { candidate_name, ward, is_paper, confirmed, agent, notes } = req.body;
  db.prepare('UPDATE candidates SET candidate_name = ?, ward = ?, is_paper = ?, confirmed = ?, agent = ?, notes = ? WHERE id = ?')
    .run(candidate_name ?? '', ward, is_paper ? 1 : 0, confirmed ? 1 : 0, agent ?? '', notes ?? '', req.params.id);
  res.json(db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id));
});

module.exports = router;
