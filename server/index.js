const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/admin', require('./middleware/adminAuth'), require('./routes/admin'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/streets', require('./routes/streets'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/stats', require('./routes/stats'));

// Serve static frontend in production
const fs = require('fs');
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
