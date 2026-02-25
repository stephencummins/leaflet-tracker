const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// GET /api/canvassing/groups
router.get("/groups", (req, res) => {
  const groups = db.prepare(`
    SELECT cg.*,
      COUNT(cr.id) as road_count,
      SUM(CASE WHEN cr.status = 'done' THEN 1 ELSE 0 END) as roads_done,
      SUM(CASE WHEN cr.status = 'in_progress' THEN 1 ELSE 0 END) as roads_in_progress,
      COALESCE(SUM(ct.support), 0) as total_support,
      COALESCE(SUM(ct.against), 0) as total_against,
      COALESCE(SUM(ct.undecided), 0) as total_undecided,
      COALESCE(SUM(ct.not_home), 0) as total_not_home
    FROM canvass_groups cg
    LEFT JOIN canvass_roads cr ON cr.group_id = cg.id
    LEFT JOIN canvass_tallies ct ON ct.road_id = cr.id
    GROUP BY cg.id
    ORDER BY cg.number
  `).all();
  res.json(groups);
});

// GET /api/canvassing/groups/:id
router.get("/groups/:id", (req, res) => {
  const group = db.prepare("SELECT * FROM canvass_groups WHERE id = ?").get(req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });

  const roads = db.prepare(`
    SELECT cr.*,
      v.name as canvassed_by_name,
      ct.support, ct.against, ct.undecided, ct.not_home,
      ct.volunteer_id as tally_volunteer_id,
      (SELECT COUNT(*) FROM canvass_casework cc WHERE cc.road_id = cr.id) as casework_count
    FROM canvass_roads cr
    LEFT JOIN volunteers v ON v.id = cr.canvassed_by
    LEFT JOIN canvass_tallies ct ON ct.road_id = cr.id
    WHERE cr.group_id = ?
    ORDER BY cr.sort_order
  `).all(req.params.id);

  const casework = db.prepare(`
    SELECT cc.*, cr.name as road_name, v.name as volunteer_name
    FROM canvass_casework cc
    JOIN canvass_roads cr ON cr.id = cc.road_id
    JOIN volunteers v ON v.id = cc.volunteer_id
    WHERE cr.group_id = ?
    ORDER BY cc.created_at DESC
  `).all(req.params.id);

  res.json({ ...group, roads, casework });
});

// PATCH /api/canvassing/roads/:id/status
router.patch("/roads/:id/status", (req, res) => {
  const { status, volunteer_id } = req.body;
  const valid = ["not_started", "in_progress", "done"];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const canvassed_at = status === "done" ? new Date().toISOString() : null;
  const canvassed_by = status === "done" ? (volunteer_id || null) : null;

  db.prepare(`
    UPDATE canvass_roads
    SET status = ?, canvassed_by = ?, canvassed_at = ?
    WHERE id = ?
  `).run(status, canvassed_by, canvassed_at, req.params.id);

  const road = db.prepare("SELECT * FROM canvass_roads WHERE id = ?").get(req.params.id);
  res.json(road);
});

// PUT /api/canvassing/roads/:id/tally
router.put("/roads/:id/tally", (req, res) => {
  const { volunteer_id, support = 0, against = 0, undecided = 0, not_home = 0 } = req.body;
  if (!volunteer_id) return res.status(400).json({ error: "volunteer_id required" });

  db.prepare(`
    INSERT INTO canvass_tallies (road_id, volunteer_id, support, against, undecided, not_home, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(road_id) DO UPDATE SET
      volunteer_id = excluded.volunteer_id,
      support = excluded.support,
      against = excluded.against,
      undecided = excluded.undecided,
      not_home = excluded.not_home,
      updated_at = excluded.updated_at
  `).run(req.params.id, volunteer_id, support, against, undecided, not_home);

  const tally = db.prepare("SELECT * FROM canvass_tallies WHERE road_id = ?").get(req.params.id);
  res.json(tally);
});

// POST /api/canvassing/roads/:id/casework
router.post("/roads/:id/casework", (req, res) => {
  const { volunteer_id, resident_name, address, contact, issue } = req.body;
  if (!volunteer_id || !issue) {
    return res.status(400).json({ error: "volunteer_id and issue required" });
  }

  const result = db.prepare(`
    INSERT INTO canvass_casework (road_id, volunteer_id, resident_name, address, contact, issue)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.params.id, volunteer_id, resident_name || null, address || null, contact || null, issue);

  const entry = db.prepare(`
    SELECT cc.*, cr.name as road_name, v.name as volunteer_name
    FROM canvass_casework cc
    JOIN canvass_roads cr ON cr.id = cc.road_id
    JOIN volunteers v ON v.id = cc.volunteer_id
    WHERE cc.id = ?
  `).get(result.lastInsertRowid);
  res.json(entry);
});

// GET /api/canvassing/summary
router.get("/summary", (req, res) => {
  const totals = db.prepare(`
    SELECT
      COALESCE(SUM(ct.support), 0) as total_support,
      COALESCE(SUM(ct.against), 0) as total_against,
      COALESCE(SUM(ct.undecided), 0) as total_undecided,
      COALESCE(SUM(ct.not_home), 0) as total_not_home,
      COUNT(DISTINCT CASE WHEN cr.status = 'done' THEN cr.id END) as roads_done,
      COUNT(DISTINCT cr.id) as roads_total
    FROM canvass_roads cr
    LEFT JOIN canvass_tallies ct ON ct.road_id = cr.id
  `).get();

  const casework = db.prepare(`
    SELECT cc.*, cr.name as road_name, cg.name as group_name, v.name as volunteer_name
    FROM canvass_casework cc
    JOIN canvass_roads cr ON cr.id = cc.road_id
    JOIN canvass_groups cg ON cg.id = cr.group_id
    JOIN volunteers v ON v.id = cc.volunteer_id
    ORDER BY cc.created_at DESC
  `).all();

  const groupTotals = db.prepare(`
    SELECT cg.number, cg.name, cg.assignee, cg.week,
      COUNT(cr.id) as road_count,
      SUM(CASE WHEN cr.status = 'done' THEN 1 ELSE 0 END) as roads_done,
      COALESCE(SUM(ct.support), 0) as support,
      COALESCE(SUM(ct.against), 0) as against,
      COALESCE(SUM(ct.undecided), 0) as undecided,
      COALESCE(SUM(ct.not_home), 0) as not_home
    FROM canvass_groups cg
    LEFT JOIN canvass_roads cr ON cr.group_id = cg.id
    LEFT JOIN canvass_tallies ct ON ct.road_id = cr.id
    GROUP BY cg.id
    ORDER BY cg.number
  `).all();

  res.json({ totals, groups: groupTotals, casework });
});

// DELETE /api/canvassing/casework/:id
router.delete("/casework/:id", (req, res) => {
  db.prepare("DELETE FROM canvass_casework WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
