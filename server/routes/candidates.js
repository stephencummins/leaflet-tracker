const { Router } = require('express');
const db = require('../db/connection');

const router = Router();

// GET /api/candidates - public candidates data (for SAM sync)
router.get('/', (req, res) => {
  const candidates = db.prepare('SELECT * FROM candidates ORDER BY ward').all();
  res.json(candidates);
});

module.exports = router;
