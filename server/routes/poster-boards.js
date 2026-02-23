const { Router } = require('express');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const DATA_PATH = join(__dirname, '..', 'data', 'poster-boards.json');

const AREAS = ['Eastwood Park', 'CPW', 'Belfairs', 'Leigh', 'West Leigh', 'Whitehouse Meadows'];
const STATUSES = ['pending', 'placed', 'confirmed', 'collected'];

function readBoards() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function saveBoards(boards) {
  writeFileSync(DATA_PATH, JSON.stringify(boards, null, 2));
}

const router = Router();

router.get('/', (req, res) => {
  try { res.json(readBoards()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', (req, res) => {
  try {
    const { area, address, name, phone = '', email = '', notes = '', status = 'pending' } = req.body;
    if (!area || !address || !name) return res.status(400).json({ error: 'area, address, and name are required' });
    const boards = readBoards();
    const maxNum = boards.reduce((max, b) => {
      const n = parseInt(b.id.replace('board-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const newBoard = { id: `board-${String(maxNum + 1).padStart(3, '0')}`, area, address, name, phone, email, notes, status };
    boards.push(newBoard);
    saveBoards(boards);
    res.status(201).json(newBoard);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', (req, res) => {
  try {
    const boards = readBoards();
    const idx = boards.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const allowed = ['area', 'address', 'name', 'phone', 'email', 'notes', 'status'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    boards[idx] = { ...boards[idx], ...updates };
    saveBoards(boards);
    res.json(boards[idx]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    const boards = readBoards();
    const idx = boards.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    boards.splice(idx, 1);
    saveBoards(boards);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
