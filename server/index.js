require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: ['https://roadie.stephen8n.com', 'https://auth.stephen8n.com'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/admin', require('./middleware/adminAuth'), require('./routes/admin'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/streets', require('./routes/streets'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/boundaries', require('./routes/boundaries'));

// Serve static frontend in production
const fs = require('fs');
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
