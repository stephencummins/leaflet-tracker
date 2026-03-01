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
app.use('/api/rounds', require('./routes/rounds'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/streets', require('./routes/streets'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/boundaries', require('./routes/boundaries'));
app.use('/api/walks', require('./routes/walks'));
app.use('/api/admin/poster-boards', require('./middleware/adminAuth'), require('./routes/poster-boards'));
app.use("/api/canvassing", require("./routes/canvassing"));

// Serve static frontend in production
const fs = require('fs');
const clientDist = path.join(__dirname, '..', 'client', 'dist');

// Serve nomination PDFs directly (symlinks not followed by express.static)
const nomPdfDir = path.join(require('os').homedir(), 'nomination-packs', 'pdf');
if (fs.existsSync(nomPdfDir)) {
  // Index page listing all PDFs
  app.get('/nomination-pdfs/', (req, res) => {
    const files = fs.readdirSync(nomPdfDir).filter(f => f.endsWith('.pdf')).sort();
    const rows = files.map(f => {
      const base = f.replace('.pdf', '');
      const parts = base.split('_');
      // Find the ward portion — everything after the candidate name
      // Format: firstname_lastname_ward_name.pdf
      // Use candidate DB data if available, otherwise parse filename
      const name = parts.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const ward = parts.slice(2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { file: f, name, ward };
    });

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nomination Packs — Roadie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy: #1B4332;
      --cyan: #D4A03C;
      --amber: #8B2635;
      --bg: #F5F0E6;
      --card: #FFFEF9;
      --text: #2D2418;
      --text-muted: #7A6F60;
      --border: #D8CFC0;
      --border-light: #E8E2D6;
      --shadow: 0 2px 4px rgba(45,36,24,0.08), 0 1px 3px rgba(45,36,24,0.04);
      --shadow-md: 0 4px 12px rgba(45,36,24,0.10), 0 2px 4px rgba(45,36,24,0.06);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Libre Baskerville', Georgia, serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    .header {
      background: var(--navy);
      color: var(--bg);
      padding: 24px 0;
      text-align: center;
      border-bottom: 4px solid var(--cyan);
    }
    .header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .header p {
      font-size: 0.85rem;
      color: var(--cyan);
      margin-top: 6px;
    }
    .container {
      max-width: 720px;
      margin: 32px auto;
      padding: 0 16px;
    }
    .count {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      text-align: center;
    }
    .pdf-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pdf-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--card);
      border: 1px solid var(--border-light);
      border-radius: 8px;
      padding: 14px 18px;
      text-decoration: none;
      color: var(--text);
      box-shadow: var(--shadow);
      transition: box-shadow 0.15s, border-color 0.15s;
    }
    .pdf-item:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--cyan);
    }
    .pdf-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      background: var(--amber);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: 'Playfair Display', serif;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .pdf-info { flex: 1; min-width: 0; }
    .pdf-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--navy);
    }
    .pdf-ward {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .pdf-arrow {
      flex-shrink: 0;
      color: var(--cyan);
      font-size: 1.2rem;
    }
    .back-link {
      display: block;
      text-align: center;
      margin-top: 24px;
      font-size: 0.85rem;
      color: var(--cyan);
    }
    @media (max-width: 480px) {
      .header h1 { font-size: 1.4rem; }
      .pdf-item { padding: 12px 14px; gap: 10px; }
      .pdf-name { font-size: 0.9rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Nomination Packs</h1>
    <p>Pre-filled nomination forms — Southend Liberal Democrats</p>
  </div>
  <div class="container">
    <p class="count">${files.length} candidate packs</p>
    <div class="pdf-list">
      ${rows.map(r => `
      <a class="pdf-item" href="/nomination-pdfs/${r.file}?v=${Date.now()}" target="_blank">
        <div class="pdf-icon">PDF</div>
        <div class="pdf-info">
          <div class="pdf-name">${r.name}</div>
          <div class="pdf-ward">${r.ward}</div>
        </div>
        <div class="pdf-arrow">&rarr;</div>
      </a>`).join('')}
    </div>
    <a class="back-link" href="/admin/candidates">&larr; Back to Candidates</a>
  </div>
</body>
</html>`);
  });

  // Serve individual PDFs
  app.use('/nomination-pdfs', (req, res, next) => {
    const filename = decodeURIComponent(req.path.split('/').pop());
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  }, express.static(nomPdfDir, { etag: false, lastModified: false }));
}

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
