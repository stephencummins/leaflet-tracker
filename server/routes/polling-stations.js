const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const router = Router();

let cached = null;

router.get('/', (req, res) => {
  if (!cached) {
    const filePath = path.join(__dirname, '..', 'data', 'polling-stations.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Polling stations data not found' });
    }
    cached = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  res.json(cached);
});

module.exports = router;
