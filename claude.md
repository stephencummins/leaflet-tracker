# Leaflet Tracker

A volunteer leaflet tracking app for political campaigns, styled with a **1930s British travel poster aesthetic**.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js/Express
- **Styling**: Vanilla CSS with CSS variables

## Design Theme
The app uses a vintage 1930s travel poster aesthetic inspired by London Underground and GWR posters:
- **Colors**: Railway green, mustard gold, burgundy, warm cream
- **Typography**: Playfair Display (headings), Libre Baskerville (body)
- **UI**: Art Deco geometric shapes, vintage paper textures

## Development

```bash
# Install dependencies
npm install

# Run dev server (client + server)
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3002

## Project Structure
```
client/
├── public/           # Static assets (banner images)
├── src/
│   ├── components/   # React components
│   │   └── layout/   # Header, NavBar
│   ├── pages/        # Dashboard, Zones, Leaderboard
│   ├── stores/       # Zustand state management
│   └── index.css     # Global styles & CSS variables
server/
└── index.js          # Express API server
```

## Key Files
- `client/src/index.css` — Design system with 1930s color palette
- `client/src/components/layout/Header.jsx` — Vintage banner header
- `client/src/components/layout/NavBar.jsx` — Art Deco navigation
